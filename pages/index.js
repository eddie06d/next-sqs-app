/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../firebase/clientApp";
import AppLayout from "../components/AppLayout";
import Swal from 'sweetalert2';
import { useForm } from "../hooks/useForm";

export default function Home() {
  const [ productos, setProductos ] = useState([]);
  const [ itemsSelected, setItemsSelected ] = useState([]);
  const [ cantidad, setCantidad ] = useState(0);
  const [ idSelected, setIdSelected ] = useState("");
  const [ total, setTotal ] = useState(0);
  const [ formValues, handleInputChange, reset ] = useForm({
    nombre: "",
    dni: "",
  });

  const { nombre, dni } = formValues;

  useEffect(() => {
    getDocs(collection(db, 'productos')).then(querySnapshot => {
      let products = [];
      querySnapshot.forEach(doc => { 
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setProductos(products);
    });
  }, []);

  const handleChange = (e) => {
    const id = e.target.value;
    setIdSelected(id);
  }

  const handleClick = (e) => {
    e.preventDefault();
    if(idSelected === "") {
      Swal.fire({
        title: 'Datos incompletos',
        text: 'Seleccione un producto',
        icon: 'warning',
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }
    if(cantidad <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'Ingrese una cantidad mayor a 0',
        icon: 'error',
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }
    if(itemsSelected.findIndex(item => item.id === idSelected) !== -1) {
      Swal.fire({
        title: 'Error',
        text: 'El producto ya ha sido seleccionado',
        icon: 'error',
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }
    const item = productos.find(producto => producto.id === idSelected);
    item = {
      ...item,
      cantidad: parseInt(cantidad)
    }
    setItemsSelected([ ...itemsSelected, item ]);
    setTotal(total + item.precio_unitario * cantidad);
    setCantidad(0);
    setIdSelected("");
  }

  const handleRegister = (e) => {
    e.preventDefault();
    if(!nombre || !dni) {
      Swal.fire({
        title: 'Datos incompletos',
        text: 'Ingrese su nombre y dni',
        icon: 'warning',
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }
    //Aquí se capturarian los datos de la compra y se enviaría a la cola de pedidos   
    reset();
    setItemsSelected([]);
    setTotal(0);
    Swal.fire({
      title: 'Registro exitoso',
      text: 'Se ha registrado su compra',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
    });
  }

  return (
    <AppLayout title="Procesamiento de órdenes">
      <h2 className="text-2xl font-bold my-5">Procesamiento de Órdenes</h2>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <label className="text-lg font-bold mb-2">Nombre/Razón Social</label>
          <input 
            type="text" 
            name="nombre"
            value={nombre}
            onChange={handleInputChange}
            className="border rounded-md outline-none py-2 px-4"
            placeholder="Ingresa tu Nombre o Razón Social"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-bold mb-2">RUC/DNI</label>
          <input 
            type="text"
            name="dni"
            value={dni}
            onChange={handleInputChange}
            className="border rounded-md outline-none py-2 px-4"
            placeholder="Ingresa tu RUC o DNI"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg font-bold mb-2">Fecha</label>
          <input 
            type="date"
            className="border rounded-md outline-none py-2 px-4"
          />
        </div> 
      </div>
      <div className="flex justify-center mx-auto mt-5">
        <div className="flex items-center">
          <label className="text-lg font-bold mr-3">Productos</label>
          <select className="border outline-none rounded-md py-3 px-2" onChange={handleChange}>
            <option value="" defaultValue>Selecciona un producto</option>
            {
              productos.map(producto => (
                <option key={ producto.id } value={ producto.id }>{ producto.nombre }</option>
              ))
            }
          </select>
          <label className="text-lg font-bold mr-3 ml-5">Cantidad</label>
          <input 
            type="number"
            value={cantidad}
            onChange={e => setCantidad(e.target.value)}
            className="border rounded-md outline-none py-2 px-4"
          />
          <button className="ml-5 bg-blue-800 rounded-md text-white py-2 px-4 hover:bg-blue-700" onClick={handleClick}>Agregar producto</button>
        </div>
      </div>
      <div>
        {
          itemsSelected.length == 0 && (
            <div className="mt-10">
              <img src="/no_data.svg" alt="empty-list" width={200} className="mx-auto" />
              <h2 className="text-2xl font-bold text-center">No hay productos agregados</h2>
            </div>
          )
        }
        {
          itemsSelected.length > 0 && (
            <div className="mt-5">
              <table className="border-collapse border w-full">
                <thead>
                  <tr>
                    <th className="border-2 py-2">Item</th>
                    <th className="border-2 py-2">Código</th>
                    <th className="border-2 py-2">Descripción</th>
                    <th className="border-2 py-2">Cantidad</th>
                    <th className="border-2 py-2">Precio</th>
                    <th className="border-2 py-2">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    itemsSelected.map((item, i) => (
                      <tr key={ item.id }>
                        <td className="border-2 py-2 text-center">{ i + 1}</td>
                        <td className="border-2 py-2 text-center">{ item.id }</td>
                        <td className="border-2 py-2 text-center">{ item.descripcion }</td>
                        <td className="border-2 py-2 text-center">{ item.cantidad }</td>
                        <td className="border-2 py-2 text-center">{ item.precio_unitario }</td>
                        <td className="border-2 py-2 text-center">{ (item.precio_unitario * item.cantidad).toFixed(2) }</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <div className="flex justify-end mt-3">
                <span className="text-lg font-bold">Importe total: {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-center mt-3">
                <button className="ml-5 bg-green-800 rounded-md text-white text-xl py-2 px-4 hover:bg-green-700" onClick={handleRegister}>Registrar orden</button>
              </div>
            </div>
          )
        }
      </div>
    </AppLayout>
  )
}
