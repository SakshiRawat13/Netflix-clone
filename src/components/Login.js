import { useNavigate, Link, useLocation } from "react-router-dom";
import {initializeApp} from 'firebase/app';
import {getAuth, signInWithEmailAndPassword,
createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";
import { useEffect, useState } from "react";
const Login = () =>{
  initializeApp(firebaseConfig);
  const navigate = useNavigate();
  const location= useLocation();
  const page= location.pathname === '/login' ?  true : false;;
  const [email, setEmail]= useState('');
  const [password, setPassword]= useState('');
  const [isUserExist, setUserExist]= useState(false);
  const [isEmailUsed, setEmailUsed]= useState(false);
  const auth= getAuth();
  const [emailValid, setEmailValid]= useState(true);
  const [passwordValid, setPasswordValid]= useState(true);

  const validation = (fieldName, value)=>{
    switch(fieldName){
      case 'email':
        return value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

      case 'password':
        return value.length >=6;
      
      default:
        break;
    }
  }


  const ctaClickHandler = (e) =>{
    e.preventDefault();
    if(!validation('email', email) || !validation('password', password)){
      setEmailValid(validation('email', email));
      setPasswordValid(validation('password', password));
      return;
    }
    if(page){
      signInWithEmailAndPassword(auth, email, password)
    .then(auth =>{
      if(auth){
        navigate('/dashboard');
      }
    })
    .catch(error => setUserExist(true));// matlab user doesnt exist and it will ask us to go to sign up section
    // user not found
    }
    else{
      createUserWithEmailAndPassword(auth, email, password)
      .then(
        auth =>{
          if(auth){
            navigate('/dashboard');
          }
        }
      )
      .catch(error => setEmailUsed(true));

    }
  }
  useEffect(()=>{
    setUserExist(false);
    setEmailUsed(false);
  }, [location]) 
  const emailOnChangehandler = (e) =>{
      setEmail(e.target.value);
  }
  const passwordOnChangeHandler = (e)=>{
     setPassword(e.target.value);
  }
    return (
      <div className="login">
      <div className="holder">
        <h1 className="text-white">
          { page ? 'Sign In' : 'Register'}</h1>
        <br/>
        <form>
          <input 
          className="form-control" 
          value= {email} 
          onChange= {emailOnChangehandler} 
          type="email" 
          placeholder="Email"/>
          {!emailValid && <p className="text-danger">Invalid/blank Email</p>}
          <input
           className="form-control" 
           value= {password} 
           onChange= {passwordOnChangeHandler} 
           type="password" 
           placeholder="Password"/>
           {!passwordValid && <p className="text-danger">Invalid/blank Passowrd</p>}
          <button className="btn btn-danger btn-block" onClick={ctaClickHandler}>
          { page ? 'Sign In' : 'Register'} </button>
          <br/> 
          {page && <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
            <label className="form-check-label text-white" htmlFor="flexCheckDefault">
              Remember Me
            </label>
          </div>}
        </form>
        <br/>
        <br/>
        {isUserExist && <p className="text-danger"> User doesn't exist | Go for Sign Up</p>}
        {isEmailUsed && <p className="text-danger"> User already exists | Go for Sign In</p>}
        <div className="login-form-other">
          <div className="login-signup-now">
          { page ? ' New to Netflix? ' : 'Existing User? '} &nbsp;
            <Link className=" " to={page ? '/register': '/login'} href="/" >
            {page ? 'Sign up now': 'Sign in'} 
            </Link>.
          </div>
        </div>
      </div>
      <div className="shadow"></div>
      <img className="concord-img vlv-creative" src="https://assets.nflxext.com/ffe/siteui/vlv3/6e32b96a-d4be-4e44-a19b-1bd2d2279b51/ee068656-14b9-4821-89b4-53b4937d9f1c/IN-en-20220516-popsignuptwoweeks-perspective_alpha_website_small.jpg" alt="" />
    </div>
    )
}
export default Login;