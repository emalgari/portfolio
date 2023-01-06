import '../contact/Contact.css';
import React from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { useState } from 'react';
import AlertMsg from '../../components/alertMsg/AlertMsg';

const Contact = () => {
    /********useState Hooks********/
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [email,setEmail] = useState("");
    const [message,setMessage] = useState("");
    const [data,setData] = useState([]);
    const [alert, setAlert] = useState(null);
    /********useState Hooks End********/

    /********Regex for email and name validation********/
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const nameRegex = /^[A-Za-z]+$/;
    /********Regex for email and name validation End********/

    /********Function for alert message/message time out********/
    const showAlert = (message, type) => {
        setAlert({
            msg: message,
            type: type
        })
        setTimeout(() => {
            setAlert(null);
        }, 3000);
    }
    /********Function for alert message/message time out End********/
    
    /**********************Function for submission handler*****************/
    const submitHandler = (e) => {
        e.preventDefault();

        //To clear form for new contact user.
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            message: message
        }
        setData([...data, newUser]);
        setFirstName("");
        setLastName("");
        setEmail("");
        setMessage("");
       
        // Contact form validation.
        if (firstName === '' || lastName === '' || email === '' || message === ''){
            showAlert("All fields are required.", `warning`);
        }
        else if ((nameRegex.test(firstName) && nameRegex.test(lastName)) === false){
            showAlert("Invalid Name. Please enter valid name.", "danger")
        }
        else if (emailRegex.test(email) === false){
            showAlert("Invalid email. Please enter a valid email.", "danger");
        }
        else{
            showAlert(`${firstName} ${lastName}, Thank You!. We will reply soon via email: ${email}.`, "success");
        } 
            
    };
    /************************Function for submission handler End**********************/

    return (
        <>
            {/*****************Contact Form*************************/}
            <Form className="container border border-primary border-2 rounded-3 col-lg-7 col-11 mt-auto p-2 text-white bg-info bg-opacity-10" onSubmit={submitHandler}>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="First Name" value={firstName} onChange = {(e) => {setFirstName(e.target.value)}} required />
                    </Form.Group>

                    <Form.Group as={Col} controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Last Name" value={lastName} onChange = {(e)=> {setLastName(e.target.value)}} required />
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email" value={email} onChange = {(e)=> {setEmail(e.target.value)}} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="message">
                    <Form.Label>Your Message</Form.Label>
                    <Form.Control as="textarea" aria-label="With textarea" value={message} onChange = {(e) => {setMessage(e.target.value)}} required/>
                </Form.Group>

                <div className="text-center">
                                    
                    <Button variant="danger" type='submit' onClick={submitHandler}>
                        Send
                    </Button>

                    {alert && <AlertMsg showAlert = {alert} onHide={()=> setAlert(false)}/>}

                </div>
                 
            </Form>
            {/*****************Contact Form End************************/}

            {/*******Alert Message component*********/}
            {<AlertMsg alert={alert}/>}

        </>
    );
}

export default Contact;