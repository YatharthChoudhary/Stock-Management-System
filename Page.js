"use client"
import Header from '@/components/Header'
import Image from 'next/image'
import { useState, useEffect } from 'react'
export default function Home() {
  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingaction, setLoadingaction] = useState(false)
  const [alert, setAlert] = useState("")

  const [dropdown, setDropdown] = useState([])
 
  useEffect(() => {
    const fatchProducts = async ()=>{
      const response = await fetch('/api/product')
      let rjson = await response.json()
      setProducts(rjson.products)
    }
    fatchProducts()
  }, [])
  const buttonAction = async (action, slug , initialQuantity) => {
    // Update for value

    let index = products.findIndex((item)=>item.slug == slug)
    let newProducts = JSON.parse(JSON.stringify(products))
    if(action == "plus"){
      newProducts[index].quantity= parseInt(initialQuantity) + 1
    }
    else{
      newProducts[index].quantity= parseInt(initialQuantity) - 1
    }
    setProducts(newProducts)
    console.log(action,slug)
    setLoadingaction(true)

//Update for dropdown 

    let indexdrop = dropdown.findIndex((item)=>item.slug == slug)
    let newDropdown = JSON.parse(JSON.stringify(dropdown))
    if(action == "plus"){
      newDropdown[indexdrop].quantity= parseInt(initialQuantity) + 1
      setAlert("Your Product Has Been Added Successfully!!");
    }
    else{
      newDropdown[indexdrop].quantity= parseInt(initialQuantity) - 1
      setAlert("Your Product Has Been Subtract Successfully!!");
    }
    setDropdown(newDropdown)
    console.log(action,slug)
    setLoadingaction(true)


    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({action,slug,initialQuantity})
    });
    const r = await response.json()
    console.log(r)
    setLoadingaction(false)
  }

  
  const addProduct = async (e) => {
    try {
      // Send a POST request to add the product
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });

      // Handle the response or show a success message here
      if (response.ok) {
        console.log('Product added successfully!!');
        setAlert("Your Product Has Been Added Successfully!!")
        setProductForm({})
      } else {
        console.error('Error adding product');
      }
    } catch (error) {
      console.error('Error : ', error);
    }
// Fatch product again
    const response = await fetch('/api/product')
      let rjson = await response.json()
      setProducts(rjson.products)


    e.preventDefault();

  }// Render your form and input fields here
const handleChange = (e) => {
  setProductForm({ ...productForm, [e.target.name]: e.target.value })
}


const onDropdownEdit = async(e) =>{
  let value = e.target.value
  setQuery(value)
  if(query.length>3){
    setLoading(true)
    const response = await fetch('/api/search?query=' + query)
    let rjson = await response.json()
    setDropdown(rjson.products)
    setLoading(false)
    }
    else{
      setDropdown([])
    }
} 

return (
  <>
    <Header />
    <div className="container  my-8 mx-auto">
    <div className='text-green-800 text-center'>{alert}</div>
      <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>
      <div className='flex mb-2'>
        <input onChange={onDropdownEdit}
          type="text"
          placeholder='Enter a Product Name'
          className='w-full border border-gray-300 px-4 py-2 rounded-r-md'
        />
        <select className='border border-gray-300 px-4 py-2 rounded-r-md'>
          <option value="">All</option>
          <option value="category1">category 1</option>
          <option value="category2">category 2</option>
        </select>
      </div>
      {loading && (<div className='flex justify-center item-center'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="50" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
  <circle cx="50" cy="50" r="40" stroke="#000" strokeWidth="10" fill="none">
    <animate attributeName="stroke-dashoffset" dur="2s" from="0" to="251.2" repeatCount="indefinite" />
    <animate attributeName="stroke-dasharray" dur="2s" values="150.6 100.4;1 250;150.6 100.4" repeatCount="indefinite" />
  </circle>
</svg>
</div>
)}
<div className='dropcontainer absolute w-[73vw] border-1 bg-purple-100 rounder-md'>

      {dropdown.map(item=>{
        return <div key={item.slug} className='container flex justify-between p-2 my-1 border-b-2'>
          <span className= "slug">{item.slug} ({item.quantity} available for ₹{item.price})</span>
          <div className='mx-5'>

          <button onClick={()=>{buttonAction("plus",item.slug,item.quantity)}} disabled={loadingaction} className='add inline block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200'>
            +
          </button>
          
          <span className= "Quantity inline-block w-6 mx-3 ">{item.quantity}</span>
          <button onClick={()=>{buttonAction("minus",item.slug, item.quantity)}} disabled={loadingaction} className='subtract inline block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200'>
            -
          </button>
          </div>
        </div>
      })}
    </div>
  </div>
    {/* Display Current Stocks*/}
    <div className="container  my-8 mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>
      {/* Form for adding a new product */}
      <form>
        <div className="mb-4">
          <label htmlFor="productName" className="block font-medium text-gray-700">Product Slug:</label>
          <input value={productForm?.slug || ""} name='slug' onChange={handleChange} type="text" id="productName" className="border-2 border-gray-300 p-2 rounded-md w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="quantity" className="block font-medium text-gray-700">Quantity:</label>
          <input value={productForm?.quantity || ""} name='quantity' onChange={handleChange} type="number" id="quantity" className="border-2 border-gray-300 p-2 rounded-md w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block font-medium text-gray-700">Price:</label>
          <input value={productForm?.price || ""} name='price' onChange={handleChange} type="number" id="price" step="0.01" className="border-2 border-gray-300 p-2 rounded-md w-full" />
        </div>
        <button
  onClick={addProduct}
  type="submit"
  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md"
>
  Add Product
</button>      </form>
      <div></div>
      {/* Your stock table */}
    </div> <div className="container my-8  mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Display Current Stocks</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {}
          {products.map(product=>{
            return <tr key={product.slug}>
            <td className="border px-4 py-2">{product.slug}</td>
            <td className="border px-4 py-2">{product.quantity}</td>
            <td className="border px-4 py-2">₹{product.price}</td>
          </tr>
          })}
          
        </tbody>
      </table>
    </div>
  </>
)
}
