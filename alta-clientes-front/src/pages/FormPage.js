// src/pages/FormPage.js
// Azure solution is a commented block down this page.
import { useForm } from 'react-hook-form';
import { Accordion, Dropdown, Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useState, onSubmit, formRef } from 'react';
import emailjs from 'emailjs-com';





function FormPage() {
    const { register, handleSubmit,formState: { errors } } = useForm();
    const [otrosContactos, setOtrosContactos] = React.useState([]);
    const [direccionesAdicionales, setDireccionesAdicionales] = React.useState([]);
    const [pdfFile1, setPdfFile1] = useState(null);
    const [pdfFile2, setPdfFile2] = useState(null);


    const agregarOtroContacto = () => {
        setOtrosContactos([...otrosContactos, {}]);
    };
    const eliminarContacto = (index) => {
        setOtrosContactos(otrosContactos.filter((_, i) => i !== index));
    };

    const agregarDireccionAdicional = () => {
        setDireccionesAdicionales([...direccionesAdicionales, {}]);
    };
    const eliminarDireccionAdicional = (index) => {
        setDireccionesAdicionales(direccionesAdicionales.filter((_, i) => i !== index));
    };

    


    
    const onSubmit = async (data) => {
        if (Object.keys(errors).length === 0) {
            try {
            // Create FormData object and populate it with all form data
            const formData = new FormData();
        
            // Automatically append all form fields, including files
            Object.keys(data).forEach((key) => {
                const value = data[key];
                if (value instanceof FileList) {
                // For file input fields, add each file separately
                Array.from(value).forEach((file) => {
                    formData.append(key, file);
                });
                } else {
                // For other fields, add them directly
                formData.append(key, value);
                }
            });
        
            // Send POST request with FormData
            const response = await axios.post('http://localhost:5001/send-email', formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);  // Handle response as needed
            alert("Form submitted successfully!");
            } catch (error) {
            console.error("Error submitting form:", error);
            alert("There was an error submitting the form.");
            }
        } else {
            alert("Please fix the errors before submitting.");
        }
        };
  


    // const onSubmit = (data) => {
        
    //     // Create a FormData object to include the form fields and files
    //     const formDataToSend = new FormData();
    
    //     // Append text fields
    //     formDataToSend.append('to_name', 'data.nombreApellido');
    //     formDataToSend.append('cc_email', 'davor.vindis99@gmail.com'); // Example CC email
    //     formDataToSend.append('data', 'abc'); // Example data
    
    //     // Append files
    //     if (pdfFile1) formDataToSend.append('pdfFile1', pdfFile1);
    //     if (pdfFile2) formDataToSend.append('pdfFile2', pdfFile2);
    //     // Send data with EmailJS
    //     emailjs.sendForm('service_q8md7l3', 'template_p5ffffn', formDataToSend, 'AW8tL9IBmurnR2gj0')
    //       .then((result) => {
    //         console.log('Email sent successfully:', result.text);
    //         alert('Form submitted and email sent successfully!');
    //       })
    //       .catch((error) => {
    //         console.error('Error sending email:', error.text);
    //         alert('There was an error submitting the form.');
    //       });
    //   };




    const generatePDF = (data) => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height; // Get the page height
        let y = 20; // Start position for text

        doc.setFontSize(16);
        doc.text("Form Submission", 20, y);
        y += 10;

        doc.setFontSize(12);
        Object.keys(data).forEach((key) => {
            const value = Array.isArray(data[key]) ? data[key].join(", ") : data[key];

            // Check if adding the next line will exceed page height
            if (y + 10 > pageHeight) {
                doc.addPage(); // Add new page
                y = 20; // Reset y position for the new page
            }

            doc.text(`${key}: ${value}`, 20, y);
            y += 10; // Move y position down for the next line
        });

        doc.save("form-submission.pdf");
    };

    return (
        <Container>
            <h2 className="my-4">Formulario de Alta Cliente</h2>
            <Form onSubmit={handleSubmit(onSubmit)} id='form-to-pdf'>

                {/* <Accordion defaultActiveKey="0" className="mb-4">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>1. Datos del Territory Manage o Vendedor</Accordion.Header>
                        <Accordion.Body>
                            Section 1: Datos del Territory Manager
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>1. Datos del Territory Manager</Card.Title>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group controlId="nombreApellido">
                                                <Form.Label>Nombre y Apellido</Form.Label>
                                                <Form.Control type="text" placeholder="Nombre y Apellido" {...register('nombreApellido', { required: true })} />
                                                {errors.nombreApellido && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="region">
                                                <Form.Label>Región Asignada</Form.Label>
                                                <Form.Control type="text" placeholder="Región Asignada" {...register('region', { required: true })} />
                                                {errors.region && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="cargo">
                                                <Form.Label>Cargo</Form.Label>
                                                <Form.Control type="text" placeholder="Cargo" {...register('cargo', { required: true })} />
                                                {errors.cargo && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                
                <Accordion defaultActiveKey="0" className="mb-4">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>2. Informacion general del cliente</Accordion.Header>
                        <Accordion.Body>
                            Section 2: Información General
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>2. Información General</Card.Title>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group controlId="nombreRazonSocial">
                                                <Form.Label>Nombre y Apellido (Razón Social)</Form.Label>
                                                <Form.Control type="text" placeholder="Razón Social" {...register('nombreRazonSocial', { required: true })} />
                                                {errors.nombreRazonSocial && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="nombreFantasia">
                                                <Form.Label>Nombre de Fantasía</Form.Label>
                                                <Form.Control type="text" placeholder="Nombre de Fantasía" {...register('nombreFantasia', { required: true })} />
                                                {errors.nombreFantasia && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="cuit">
                                                <Form.Label>Número de CUIT</Form.Label>
                                                <Form.Control type="text" placeholder="NN-NNNNNNN-N" {...register('cuit', { required: true, pattern: /^\d{2}-\d{7}-\d$/ })} />
                                                {errors.cuit && <p className="text-danger">Formato de CUIT inválido</p>}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>


                            {/* Dirección Fiscal }
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>Dirección Fiscal</Card.Title>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group controlId="direccion">
                                                <Form.Label>Dirección</Form.Label>
                                                <Form.Control type="text" placeholder="Dirección" {...register('direccion', { required: true })} />
                                                {errors.direccion && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group controlId="numero">
                                                <Form.Label>Número</Form.Label>
                                                <Form.Control type="text" placeholder="Número" {...register('numero', { required: true })} />
                                                {errors.numero && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group controlId="piso">
                                                <Form.Label>Piso (si corresponde)</Form.Label>
                                                <Form.Control type="text" placeholder="Piso" {...register('piso')} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="departamento">
                                                <Form.Label>Departamento/Casa/Otro</Form.Label>
                                                <Form.Control type="text" placeholder="Departamento" {...register('departamento')} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="localidad">
                                                <Form.Label>Localidad</Form.Label>
                                                <Form.Control type="text" placeholder="Localidad" {...register('localidad', { required: true })} />
                                                {errors.localidad && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="provincia">
                                                <Form.Label>Provincia</Form.Label>
                                                <Form.Control type="text" placeholder="Provincia" {...register('provincia', { required: true })} />
                                                {errors.provincia && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="pais">
                                                <Form.Label>País</Form.Label>
                                                <Form.Control type="text" placeholder="País" {...register('pais', { required: true })} />
                                                {errors.pais && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <Accordion defaultActiveKey="0" className="mb-4">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>3. Contactos</Accordion.Header>
                        <Accordion.Body>
                            Contactos
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>Contactos</Card.Title>

                                    Contacto Comercial
                                    <h5>1 Contacto Comercial</h5>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group controlId="contactoComercialNombre">
                                                <Form.Label>Nombre y Apellido</Form.Label>
                                                <Form.Control type="text" placeholder="Nombre y Apellido" {...register('contactoComercialNombre', { required: true })} />
                                                {errors.contactoComercialNombre && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="contactoComercialEmail">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="email" placeholder="Email" {...register('contactoComercialEmail', { required: true })} />
                                                {errors.contactoComercialEmail && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="contactoComercialTelefono">
                                                <Form.Label>Número de Teléfono</Form.Label>
                                                <Form.Control type="text" placeholder="Teléfono" {...register('contactoComercialTelefono', { required: true })} />
                                                {errors.contactoComercialTelefono && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="contactoComercialCargo">
                                                <Form.Label>Cargo</Form.Label>
                                                <Form.Control type="text" placeholder="Cargo" {...register('contactoComercialCargo', { required: true })} />
                                                {errors.contactoComercialCargo && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    Contacto Administrativo
                                    <h5>2 Contacto Administrativo</h5>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group controlId="contactoAdministrativoNombre">
                                                <Form.Label>Nombre y Apellido</Form.Label>
                                                <Form.Control type="text" placeholder="Nombre y Apellido" {...register('contactoAdministrativoNombre', { required: true })} />
                                                {errors.contactoAdministrativoNombre && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="contactoAdministrativoEmail">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="email" placeholder="Email" {...register('contactoAdministrativoEmail', { required: true })} />
                                                {errors.contactoAdministrativoEmail && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="contactoAdministrativoTelefono">
                                                <Form.Label>Número de Teléfono</Form.Label>
                                                <Form.Control type="text" placeholder="Teléfono" {...register('contactoAdministrativoTelefono', { required: true })} />
                                                {errors.contactoAdministrativoTelefono && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="contactoAdministrativoCargo">
                                                <Form.Label>Cargo</Form.Label>
                                                <Form.Control type="text" placeholder="Cargo" {...register('contactoAdministrativoCargo', { required: true })} />
                                                {errors.contactoAdministrativoCargo && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    Contacto Contable e Impositivo
                                    <h5>3 Contacto Contable e Impositivo</h5>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group controlId="contactoContableNombre">
                                                <Form.Label>Nombre y Apellido</Form.Label>
                                                <Form.Control type="text" placeholder="Nombre y Apellido" {...register('contactoContableNombre', { required: true })} />
                                                {errors.contactoContableNombre && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="contactoContableEmail">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="email" placeholder="Email" {...register('contactoContableEmail', { required: true })} />
                                                {errors.contactoContableEmail && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="contactoContableTelefono">
                                                <Form.Label>Número de Teléfono</Form.Label>
                                                <Form.Control type="text" placeholder="Teléfono" {...register('contactoContableTelefono', { required: true })} />
                                                {errors.contactoContableTelefono && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="contactoContableCargo">
                                                <Form.Label>Cargo</Form.Label>
                                                <Form.Control type="text" placeholder="Cargo" {...register('contactoContableCargo', { required: true })} />
                                                {errors.contactoContableCargo && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    Otros Contactos
                                    <h5>4 Otros Contactos</h5>
                                    {otrosContactos.map((contacto, index) => (
                                        <Card key={index} className="mb-3">
                                            <Card.Body>
                                                <Row className="mb-3">
                                                    <Col md={6}>
                                                        <Form.Group controlId={`otroContactoNombre${index}`}>
                                                            <Form.Label>Nombre y Apellido</Form.Label>
                                                            <Form.Control type="text" placeholder="Nombre y Apellido" {...register(`otrosContactos[${index}].nombre`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId={`otroContactoEmail${index}`}>
                                                            <Form.Label>Email</Form.Label>
                                                            <Form.Control type="email" placeholder="Email" {...register(`otrosContactos[${index}].email`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId={`otroContactoTelefono${index}`}>
                                                            <Form.Label>Número de Teléfono</Form.Label>
                                                            <Form.Control type="text" placeholder="Teléfono" {...register(`otrosContactos[${index}].telefono`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId={`otroContactoCargo${index}`}>
                                                            <Form.Label>Cargo</Form.Label>
                                                            <Form.Control type="text" placeholder="Cargo" {...register(`otrosContactos[${index}].cargo`)} />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Button variant="danger" onClick={() => eliminarContacto(index)} className="mt-2">
                                                    Borrar contacto
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                    <Button variant="secondary" onClick={agregarOtroContacto}>+ Agregar otro contacto</Button>
                                </Card.Body>
                            </Card>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <Accordion defaultActiveKey="0" className="mb-4">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>4.  Información Logística</Accordion.Header>
                        <Accordion.Body>
                            {/* Nueva Sección: Información Logística}
                            <Card className="mb-4">
                                <Card.Body>
                                    {/* <Card.Title>4. Información Logística</Card.Title> }
                                    {/* Dirección de Entrega Principal }
                                    <h5> Dirección de Entrega Principal</h5>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group controlId="direccionPrincipal">
                                                <Form.Label>Dirección</Form.Label>
                                                <Form.Control type="text" placeholder="Dirección" {...register('direccionPrincipal', { required: true })} />
                                                {errors.direccionPrincipal && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group controlId="numeroPrincipal">
                                                <Form.Label>Número</Form.Label>
                                                <Form.Control type="text" placeholder="Número" {...register('numeroPrincipal', { required: true })} />
                                                {errors.numeroPrincipal && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group controlId="pisoPrincipal">
                                                <Form.Label>Piso (en caso de corresponder)</Form.Label>
                                                <Form.Control type="text" placeholder="Piso" {...register('pisoPrincipal')} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="departamentoPrincipal">
                                                <Form.Label>Departamento/Casa/Otro</Form.Label>
                                                <Form.Control type="text" placeholder="Departamento" {...register('departamentoPrincipal')} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="entreCallesPrincipal">
                                                <Form.Label>Entre qué calles</Form.Label>
                                                <Form.Control type="text" placeholder="Entre qué calles" {...register('entreCallesPrincipal')} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group controlId="codigoPostalPrincipal">
                                                <Form.Label>Código Postal</Form.Label>
                                                <Form.Control type="text" placeholder="Código Postal" {...register('codigoPostalPrincipal', { required: true })} />
                                                {errors.codigoPostalPrincipal && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="localidadPrincipal">
                                                <Form.Label>Localidad</Form.Label>
                                                <Form.Control type="text" placeholder="Localidad" {...register('localidadPrincipal', { required: true })} />
                                                {errors.localidadPrincipal && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="provinciaPrincipal">
                                                <Form.Label>Provincia</Form.Label>
                                                <Form.Control type="text" placeholder="Provincia" {...register('provinciaPrincipal', { required: true })} />
                                                {errors.provinciaPrincipal && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="paisPrincipal">
                                                <Form.Label>País</Form.Label>
                                                <Form.Control type="text" placeholder="País" {...register('paisPrincipal', { required: true })} />
                                                {errors.paisPrincipal && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="horarioEntregaPrincipal">
                                                <Form.Label>Horario(s) de Entrega</Form.Label>
                                                <Form.Control type="text" placeholder="Horario(s) de Entrega" {...register('horarioEntregaPrincipal')} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="personaRecibeNombrePrincipal">
                                                <Form.Label>Nombre y Apellido de la Persona que Recibe la Mercadería</Form.Label>
                                                <Form.Control type="text" placeholder="Nombre y Apellido" {...register('personaRecibeNombrePrincipal')} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="personaRecibeDNIPrincipal">
                                                <Form.Label>DNI de la Persona que Recibe la Mercadería</Form.Label>
                                                <Form.Control type="text" placeholder="DNI" {...register('personaRecibeDNIPrincipal')} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="personaRecibeTelefonoPrincipal">
                                                <Form.Label>Teléfono de Contacto de la Persona que Recibe la Mercadería</Form.Label>
                                                <Form.Control type="text" placeholder="Teléfono" {...register('personaRecibeTelefonoPrincipal')} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="personaRecibeEmailPrincipal">
                                                <Form.Label>Email de Contacto de la Persona que Recibe la Mercadería</Form.Label>
                                                <Form.Control type="email" placeholder="Email" {...register('personaRecibeEmailPrincipal')} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Dropdown.Divider />

                                    {/* Dirección de Entrega Adicionales }
                                    {/* Dirección de Entrega Adicionales }
                                    <h5>Dirección de Entrega Adicional</h5>
                                    {direccionesAdicionales.map((direccion, index) => (
                                        <Card key={index} className="mb-3">
                                            <Card.Body>
                                                <Row className="mb-3">
                                                    <Col md={6}>
                                                        <Form.Group controlId={`direccionAdicional${index}`}>
                                                            <Form.Label>Dirección</Form.Label>
                                                            <Form.Control type="text" placeholder="Dirección" {...register(`direccionesAdicionales[${index}].direccion`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Group controlId={`numeroAdicional${index}`}>
                                                            <Form.Label>Número</Form.Label>
                                                            <Form.Control type="text" placeholder="Número" {...register(`direccionesAdicionales[${index}].numero`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Group controlId={`pisoAdicional${index}`}>
                                                            <Form.Label>Piso (en caso de corresponder)</Form.Label>
                                                            <Form.Control type="text" placeholder="Piso" {...register(`direccionesAdicionales[${index}].piso`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId={`departamentoAdicional${index}`}>
                                                            <Form.Label>Departamento/Casa/Otro</Form.Label>
                                                            <Form.Control type="text" placeholder="Departamento" {...register(`direccionesAdicionales[${index}].departamento`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId={`entreCallesAdicional${index}`}>
                                                            <Form.Label>Entre qué calles</Form.Label>
                                                            <Form.Control type="text" placeholder="Entre qué calles" {...register(`direccionesAdicionales[${index}].entreCalles`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Group controlId={`codigoPostalAdicional${index}`}>
                                                            <Form.Label>Código Postal</Form.Label>
                                                            <Form.Control type="text" placeholder="Código Postal" {...register(`direccionesAdicionales[${index}].codigoPostal`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId={`localidadAdicional${index}`}>
                                                            <Form.Label>Localidad</Form.Label>
                                                            <Form.Control type="text" placeholder="Localidad" {...register(`direccionesAdicionales[${index}].localidad`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId={`provinciaAdicional${index}`}>
                                                            <Form.Label>Provincia</Form.Label>
                                                            <Form.Control type="text" placeholder="Provincia" {...register(`direccionesAdicionales[${index}].provincia`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId={`paisAdicional${index}`}>
                                                            <Form.Label>País</Form.Label>
                                                            <Form.Control type="text" placeholder="País" {...register(`direccionesAdicionales[${index}].pais`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId={`horarioEntregaAdicional${index}`}>
                                                            <Form.Label>Horario(s) de Entrega</Form.Label>
                                                            <Form.Control type="text" placeholder="Horario(s) de Entrega" {...register(`direccionesAdicionales[${index}].horarioEntrega`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId={`personaRecibeNombreAdicional${index}`}>
                                                            <Form.Label>Nombre y Apellido de la Persona que Recibe la Mercadería</Form.Label>
                                                            <Form.Control type="text" placeholder="Nombre y Apellido" {...register(`direccionesAdicionales[${index}].personaRecibeNombre`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId={`personaRecibeDNIAdicional${index}`}>
                                                            <Form.Label>DNI de la Persona que Recibe la Mercadería</Form.Label>
                                                            <Form.Control type="text" placeholder="DNI" {...register(`direccionesAdicionales[${index}].personaRecibeDNI`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId={`personaRecibeTelefonoAdicional${index}`}>
                                                            <Form.Label>Teléfono de Contacto de la Persona que Recibe la Mercadería</Form.Label>
                                                            <Form.Control type="text" placeholder="Teléfono" {...register(`direccionesAdicionales[${index}].personaRecibeTelefono`)} />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId={`personaRecibeEmailAdicional${index}`}>
                                                            <Form.Label>Email de Contacto de la Persona que Recibe la Mercadería</Form.Label>
                                                            <Form.Control type="email" placeholder="Email" {...register(`direccionesAdicionales[${index}].personaRecibeEmail`)} />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                {/* Botón para eliminar esta dirección adicional }
                                                <Button variant="danger" onClick={() => eliminarDireccionAdicional(index)} className="mt-2">
                                                    Borrar dirección
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                    <Button variant="secondary" onClick={agregarDireccionAdicional}>+ Agregar otra dirección de entrega</Button>

                                </Card.Body>
                            </Card>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <Accordion defaultActiveKey="0" className="mb-4">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>5. Informacion de pagos</Accordion.Header>
                        <Accordion.Body>
                            {/* Informacion de Pagos }
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>Información de Pagos</Card.Title>

                                    {/* Plazo de Pago }
                                    <h5>Plazo de Pago</h5>
                                    <Form.Group>
                                        {['30 DÍAS FECHA DE FACTURA', '21 DÍAS FECHA DE FACTURA', '15 DÍAS FECHA DE FACTURA', '10 DÍAS FECHA DE FACTURA', '7 DÍAS FECHA DE FACTURA', 'CONTADO CUENTA CORRIENTE'].map((option, index) => (
                                            <Form.Check
                                                key={index}
                                                type="radio"
                                                label={option}
                                                value={option}
                                                {...register('plazoPago', { required: true })}
                                                name="plazoPago"
                                                className="mb-2"
                                            />
                                        ))}
                                        {errors.plazoPago && <p className="text-danger">Este campo es requerido</p>}
                                    </Form.Group>

                                    {/* Medio de Pago }
                                    <h5>Medio de Pago</h5>
                                    <Form.Group>
                                        {['CONTADO – EFECTIVO', 'TRANSFERENCIA BANCARIA'].map((option, index) => (
                                            <Form.Check
                                                key={index}
                                                type="checkbox"
                                                label={option}
                                                value={option}
                                                {...register('medioPago')}
                                                className="mb-2"
                                            />
                                        ))}
                                    </Form.Group>

                                    {/* Días de Entrega Acordados }
                                    <h5>Días de Entrega Acordados</h5>
                                    <Form.Group controlId="diasEntrega">
                                        <Form.Control
                                            type="text"
                                            placeholder="Días de Entrega Acordados"
                                            {...register('diasEntrega', { required: true })}
                                        />
                                        {errors.diasEntrega && <p className="text-danger">Este campo es requerido</p>}
                                    </Form.Group>

                                    {/* Tipo de Cliente }
                                    <h5>Tipo de Cliente</h5>
                                    <Form.Group>
                                        {[
                                            'DISTRIBUIDOR ESTRATÉGICO CON DISTRIBUCIÓN ACTIVA',
                                            'DISTRIBUIDOR ESTRATÉGICO MOSTRADOR',
                                            'MAYORISTA CON DISTRIBUCIÓN ACTIVA',
                                            'MAYORISTA REVENTA',
                                            'REVENDEDOR MINORISTA',
                                            'CUENTA CLAVE MINORISTA'
                                        ].map((option, index) => (
                                            <Form.Check
                                                key={index}
                                                type="checkbox"
                                                label={option}
                                                value={option}
                                                {...register('tipoCliente')}
                                                className="mb-2"
                                            />
                                        ))}
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>


                <Accordion defaultActiveKey="0" className="mb-4">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>6. Informacion fiscal</Accordion.Header>
                        <Accordion.Body>
                            Nueva Sección: Información Fiscal
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>5. Información Fiscal</Card.Title>

                                    5.1 Impuesto al Valor Agregado (IVA)
                                    <h5>6.1 Impuesto al Valor Agregado (IVA)</h5>
                                    <Form.Group>
                                        {['RESPONSABLE INSCRIPTO', 'SUJETO EXENTO', 'MONOTRIBUTISTA', 'SUJETO DEL EXTERIOR'].map((option, index) => (
                                            <Form.Check
                                                key={index}
                                                type="radio"
                                                label={option}
                                                value={option}
                                                {...register('impuestoIVA', { required: true })} // Make sure to register with the correct name
                                                className="mb-2"
                                            />
                                        ))}
                                        {errors.impuestoIVA && <p className="text-danger">Este campo es requerido</p>}
                                    </Form.Group>
                                    <Form.Group controlId="constanciaCuit" className="mb-3">
                                        <Form.Label>Adjuntar copia de la constancia de inscripción de CUIT (PDF)</Form.Label>
                                        <Form.Control type="file" accept=".pdf" {...register('constanciaCuit', { required: true })} />
                                        {errors.constanciaCuit && <p className="text-danger">Este campo es requerido</p>}
                                    </Form.Group>

                                    5.2 Impuesto a los Ingresos Brutos
                                    <h5>6.2 Impuesto a los Ingresos Brutos</h5>
                                    <Form.Group>
                                        {['SI', 'NO'].map((option, index) => (
                                            <Form.Check
                                                key={index}
                                                type="radio"
                                                label={option}
                                                value={option}
                                                {...register('impuestoIngresosBrutos', { required: true })}
                                                name="impuestoIngresosBrutos"
                                                className="mb-2"
                                            />
                                        ))}
                                        {errors.impuestoIngresosBrutos && <p className="text-danger">Este campo es requerido</p>}
                                    </Form.Group>

                                    5.3 Contribuyente de Convenio Multilateral
                                    <h5>6.3 Contribuyente de Convenio Multilateral</h5>
                                    <Form.Group>
                                        {['SI', 'NO'].map((option, index) => (
                                            <Form.Check
                                                key={index}
                                                type="radio"
                                                label={option}
                                                value={option}
                                                {...register('convenioMultilateral', { required: true })}
                                                name="convenioMultilateral"
                                                className="mb-2"
                                            />
                                        ))}
                                        {errors.convenioMultilateral && <p className="text-danger">Este campo es requerido</p>}
                                    </Form.Group>

                                    5.4 Situación frente a los Regímenes de Retención/Percepción del Impuesto sobre los Ingresos Brutos
                                    <h5>6.4 Situación frente a los Regímenes de Retención/Percepción del Impuesto sobre los Ingresos Brutos</h5>

                                    <Form.Group className="mb-2">
                                        <Form.Label>Posee algún certificado de no retención del impuesto sobre los ingresos brutos otorgado por alguna jurisdicción:</Form.Label>
                                        {['SI', 'NO'].map((option, index) => (
                                            <Form.Check
                                                key={`certificadoNoRetencion-${index}`}
                                                type="radio"
                                                label={option}
                                                value={option}
                                                {...register('certificadoNoRetencion', { required: true })}
                                                name="certificadoNoRetencion"
                                            />
                                        ))}
                                        {errors.certificadoNoRetencion && <p className="text-danger">Este campo es requerido</p>}
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label>Posee algún certificado de exención del impuesto sobre los ingresos brutos otorgado por alguna jurisdicción:</Form.Label>
                                        {['SI', 'NO'].map((option, index) => (
                                            <Form.Check
                                                key={`certificadoExencion-${index}`}
                                                type="radio"
                                                label={option}
                                                value={option}
                                                {...register('certificadoExencion', { required: true })}
                                                name="certificadoExencion"
                                            />
                                        ))}
                                        {errors.certificadoExencion && <p className="text-danger">Este campo es requerido</p>}
                                    </Form.Group>

                                    <Form.Group className="mb-2">
                                        <Form.Label>Posee algún certificado de exclusión del impuesto sobre los ingresos brutos otorgado por alguna jurisdicción:</Form.Label>
                                        {['SI', 'NO'].map((option, index) => (
                                            <Form.Check
                                                key={`certificadoExclusion-${index}`}
                                                type="radio"
                                                label={option}
                                                value={option}
                                                {...register('certificadoExclusion', { required: true })}
                                                name="certificadoExclusion"
                                            />
                                        ))}
                                        {errors.certificadoExclusion && <p className="text-danger">Este campo es requerido</p>}
                                    </Form.Group>

                                </Card.Body>
                            </Card>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
 */}
                <Form.Group controlId="nombreRazonSocial">
                                                <Form.Label>Nombre y Apellido (Razón Social)</Form.Label>
                                                <Form.Control type="text" placeholder="Razón Social" {...register('nombreRazonSocial', { required: true })} />
                                                {errors.nombreRazonSocial && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>

                        <Form.Group controlId="constanciaCuit" className="mb-3">
                            <Form.Label>Adjuntar copia de la constancia de inscripción de CUIT (PDF)</Form.Label>
                            <Form.Control type="file" accept=".pdf" {...register('constanciaCuit', { required: true })} />
                            {errors.constanciaCuit && <p className="text-danger">Este campo es requerido</p>}
                        </Form.Group>
                        <Form.Group controlId="mail">
                                                <Form.Label>Mail</Form.Label>
                                                <Form.Control type="text" placeholder="Mail" {...register('mail', { required: true })} />
                                                {errors.nombreRazonSocial && <p className="text-danger">Este campo es requerido</p>}
                                            </Form.Group>

                <Button variant="primary" type="submit">
                    Enviar
                </Button>
            </Form>
        </Container>
    );
}

export default FormPage;




  
    // * Azure solution *
    // const functionKey = "ioPmDzZow-4kDxH5QBd1pImyx_5DMaLZV7KKtQwj3Xg2AzFuvDCZqg==";
    // const backendUrl = 'https://altaclienteformulario.azurewebsites.net/api/http_trigger1?code=ioPmDzZow-4kDxH5QBd1pImyx_5DMaLZV7KKtQwj3Xg2AzFuvDCZqg==';

    //OnSubmit with MultiPartData for POST to an API
    // const onSubmit = async (data) => {
    //     if (Object.keys(errors).length === 0) {
    //       try {
    //         // Create FormData object and populate it with all form data
    //         const formData = new FormData();
      
    //         // Automatically append all form fields, including files
    //         Object.keys(data).forEach((key) => {
    //           const value = data[key];
    //           if (value instanceof FileList) {
    //             // For file input fields, add each file separately
    //             Array.from(value).forEach((file) => {
    //               formData.append(key, file);
    //             });
    //           } else {
    //             // For other fields, add them directly
    //             formData.append(key, value);
    //           }
    //         });
      
    //         // Send POST request with FormData
    //         const response = await axios.post(backendUrl, formData, {
    //           headers: {
    //             'Content-Type': 'multipart/form-data',
    //           },
    //         });
    //         console.log(response.data);  // Handle response as needed
    //         alert("Form submitted successfully!");
    //       } catch (error) {
    //         console.error("Error submitting form:", error);
    //         alert("There was an error submitting the form.");
    //       }
    //     } else {
    //       alert("Please fix the errors before submitting.");
    //     }
    //   };
  