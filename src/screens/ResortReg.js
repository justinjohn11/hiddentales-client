import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/esm/FormGroup';

const districtData = [
  {
    name:"Select"

  },
  {
    name:"Idukki",
    citys:["Idukki","Kattappana","Thodupuzha","kumily"]
  },
  {
    name:"Kottayam",
    citys:["Kottayam","Changanassery","Pala","Erattupetta","Ettumanoor","Vaikom"]
  }
];
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
export default function ResortReg() {
  const navigate = useNavigate();

  const { state } = useContext(Store);
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  const [rname,setRname]=useState("");
  const [{dist,city},setDistData]=useState({
    
    dist:"",
    city:""
  });
  const district = districtData.map((dist) => (
    <option key={dist.name} value={dist.name}>
      {dist.name}
    </option>
  ));
  const citys = districtData.find(item => item.name === dist)?.citys.map((city) =>(
    <option key={city} value={city}>
      {city}
      </option>
  ))
  const [add,setAdd]=useState("");
  const [num,setNum]=useState("");
  const [rppd,setRppd]=useState("");
  const [details,serDetails]=useState("");
  const [fac,setFac]=useState("");
  const [rdetails,setRdetails]=useState("");
  const [food,setFood]=useState(""); 
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);


  function handleDistrictChange(event) {
    setDistData(data => ({ city: '', dist: event.target.value }));
  }

  function handleCityChange(event) {
    // alert(event.target.value);
    setDistData(data => ({ ...data, city: event.target.value }));
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/places/`);
        setRname(data.rname);
        setDistData(data.dist);
        setDistData(data.city);
        setAdd(data.add);
        setNum(data.num);
        setRppd(data.rppd);
        setRdetails(data.rdetails);
        setFac(data.fac);
        setFood(data.food);
        setImage(data.image);
        setImages(data.images);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/resort/`,
        {
          
          rname,
          dist,
          city,
          add,
          num,
          rdetails,
          rppd,
          fac,
          food,
          image,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Place updated successfully');
      navigate('/admin/places');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };
  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success('Image uploaded successfully. click Update to apply it');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };
  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f);
    console.log(images);
    console.log(images.filter((x) => x !== fileName));
    setImages(images.filter((x) => x !== fileName));
    toast.success('Image removed successfully. click Update to apply it');
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Resort SignUp</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Resort Name</Form.Label>
          <Form.Control onChange={(e) => setRname(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="dist">
                    <Form.Label><b>District</b></Form.Label>
                     <select value={dist} onChange={handleDistrictChange}>
                      {district}
                    </select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="city">
                    <Form.Label><b>City</b></Form.Label>
                     <select value={city} onChange={handleCityChange}>
                     {citys}
                     </select>
                     </Form.Group>
        
                     <Form.Group className="mb-3" controlId="add">
                     <Form.Label>Address</Form.Label>
                     <Form.Control onChange={(e)=> setAdd(e.target.value)} required /> 
                     </Form.Group>
                     <Form.Group className="mb-3" controlId="add">
                     <Form.Label>Contact Number</Form.Label>
                     <Form.Control onChange={(e)=> setNum(e.target.value)} required /> 
                     </Form.Group>
                     <Form.Group className="mb-3" controlId="add">
                     <Form.Label>Image</Form.Label>
                     <Form.Control type="file"  name='file'  accept=".png, .jpg, .jpeg" autoComplete='off' onChange={(e)=> {setFile(e.target.files[0]); setFileName(e.target.files[0].name);}} />
                     </Form.Group>
                     <Form.Group className="mb-3" controlId="add">
                     <Form.Label>Room Rate Per Day</Form.Label>
                     <Form.Control type="number" onChange={(e)=> setRppd(e.target.value)}/>
                     </Form.Group>  
                     <Form.Group className="mb-3" controlId="add">
                     <Form.Label>Facilities In the Hotel</Form.Label>
                     <Form.Control onChange={(e)=> setFac(e.target.value)}/> 
                     </Form.Group>
                     <Form.Group className="mb-3" controlId="add">
                     <Form.Label>Rooms details</Form.Label>
                     <Form.Control onChange={(e)=> setRdetails(e.target.value)}  /> 
                     </Form.Group>
                     <Form.Group className="mb-3" controlId="add">
                     <Form.Label>Rooms details</Form.Label>
                     <Form.Control onChange={(e)=> setFood(e.target.value)}  /> 
                     </Form.Group>
                     
          <div className="mb-3">
          <Button type="submit">Register Resort</Button>
        </div>
          </Form>
          </Container>

);       
  }