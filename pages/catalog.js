import Layout from "../components/Layout";
import ProductList from "@/components/ProductList"
import Form from "@/components/Form"
import { PrismaClient } from '@prisma/client'
import { useState } from "react";
import { Button } from "antd";

export async function getServerSideProps(){
    const prisma = new PrismaClient();

    const categories    = await prisma.category.findMany();
    const sCategories   = categories.map(c => ({
        ...c,
        checked: false,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt ? c.updatedAt.toISOString() : ""
      }));

    const drinks        = await prisma.drink.findMany({
        include:{
            categories : {select: {name: true}}
        }
    }); 
    const sDrinks       = drinks.map(d => ({
        ...d,
        categories: d.categories.map(c => c.name),
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt ? d.updatedAt.toISOString() : ""
    }));

    const discounts     = await prisma.discount.findMany();
    const sDiscounts    = discounts.map(d => ({
        ...d,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt ? d.updatedAt.toISOString() : ""
    }));

    return({
        props:{
            categories: sCategories,
            drinks:     sDrinks,
            discounts:  sDiscounts,
        }
    })
}

const Catalog = ({categories, drinks, discounts})=>{

    const productInitialConfig  = {
        formTitle: 'Agregar Producto',
        formType: 'product',
        sections: [
            {
                sectionTitle: 'Datos Generales',
                inputs: [
                    {
                        id: 'productName',
                        type: 'text',
                        label: 'Nombre',
                        value:'',
                        required: true,
                    },
                    {   
                        id: 'productPrice',
                        type: 'price',
                        label: 'Precio',
                        value:'',
                        required: true,
                    },
                    {
                        id: 'productCategories',
                        type: 'accordion',
                        label: 'Categorias',
                        items: categories,
                        itemsType: 'checkbox',
                        selectedItems: [],
                        action: () => console.log("action"),
                        required: true,
                    },
                ]
            },
            {
                sectionTitle: 'Imagen',
                inputs:[
                    {
                        id: 'productImage',
                        type: 'fileUpload',
                        required: false,
                    }
                ]
            }
        ],
        button: {
            id: 'Add',
            text: 'Agregar Producto',
            action: addItem,
        }
    }

    const categoryInitialConfig = {
        formTitle: 'Agregar Categoría',
        formType: 'category',
        sections: [
            {
                sectionTitle: 'Datos Generales',
                inputs: [
                    {
                        id: 'categoryName',
                        type: 'text',
                        label: 'Nombre',
                        value: '',
                        required: true,
                    },
                ]
            },
            {
                sectionTitle: 'Imagen',
                inputs:[
                    {
                        id: 'categoryImage',
                        type: 'fileUpload',
                        required: false,
                    }
                ]
            }
        ],
        button: {
            id: 'Add',
            text: 'Agregar Categoria',
            action: addItem,
        }
    }

    const discountInitialConfig = {
        formTitle: 'Agregar Descuento',
        formType: 'discount',
        sections: [
            {
                sectionTitle: 'Datos Generales',
                inputs: [
                    {
                        id: 'discountDescription',
                        type: 'text',
                        label: 'Descripción',
                        value: '',
                        required: true,
                    },
                    {
                        id: 'discountPercentage',
                        type: 'price',
                        label: 'Descuento %',
                        value: '',
                        required: true,
                    },
                ]
            },
        ],
        button: {
            id: 'Add',
            text: 'Agregar Descuento',
            action: addItem,
        }
    }

    const [productConfig, setProductConfig]     = useState(productInitialConfig);

    const [categoryConfig, setCategoryConfig]   = useState(categoryInitialConfig);

    const [discountConfig, setDiscountConfig]   = useState(discountInitialConfig);

    const [showUpdateForm, setShowUpdateForm]   = useState(false);

    const inputTypes = [
        {text: 'in_'},
        {price: 'in_'},
        {accordion: 'ac_'},
        {fileUpload: 'fl_'},
        {checkBox: 'chk_'}
    ]

    function getInputValues(config) {
        const inputs = config.sections.flatMap(section => section.inputs);
    
        const inputValues = inputs.reduce((result, input) => {
            let prefix = inputTypes.find(type => type[input.type])?.[input.type];
            let formId = prefix + input.id;
            let formInput = document.getElementById(formId);
    
            let value;
    
            switch (input.type) {
                case "text":
                    value = formInput.value;
                    break;

                case "price":
                    value = formInput.value;
                    break;
    
                case "accordion":
                    const inputArray = Array.from(formInput.querySelectorAll('input[type="checkbox"]:checked'));
                    value = inputArray.map(input =>
                        input.closest('.category-list').querySelector('.span-category').textContent.trim()
                    );
                    break;
    
                default:
                    value = formInput;
                    break;
            }
            const key = input.id.replace(/([a-z])([A-Z])/g, '$1 $2') 
            .split(' ')[1] 
            .toLowerCase(); 

            result[key] = value;
            return result;
        }, {});
    
        return inputValues;
    }

    function cleanForm(config){
        const inputs = config.sections.flatMap(section => section.inputs);

        inputs.map((input) => {
            let prefix = inputTypes.find(type => type[input.type])?.[input.type]
            let formInput = document.getElementById(prefix + input.id);
    
            switch(input.type){
                case "text":
                    formInput.value = ""
                    break;

                case "price":
                    formInput.value = ""
                    break;
    
                case "accordion":
                    const inputArray = Array.from(formInput.querySelectorAll('input[type="checkbox"]:checked'));
                    inputArray.map( item =>{
                        item.checked = false;
                    });

                    const accordionButton = formInput.querySelector('.accordion-header .accordion-button');
                    if (accordionButton && accordionButton.getAttribute('aria-expanded') === 'true') {
                        accordionButton.click();
                    }
                    break;
                
                case "fileUpload":
                    formInput.value = ""
                    break;

                default:
                    break;
            }
        })
    
        window.scrollTo(0, 0);
    }
    
    async function uploadImage(formData){
        try {
            const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            });
            
            if (!cloudinaryResponse.ok) {
                const errorDetails = await cloudinaryResponse.json();
                throw new Error(errorDetails.message);
            }
            
            const cloudinaryData = await cloudinaryResponse.json();
            return cloudinaryData.secure_url;
        }
        catch (error) {
            throw new Error(error);
        }
    }

    function validateFormInput(inputValues){

        for (const inputValue of Object.values(inputValues)) {

            // VALIDATIONS
            if (inputValue == null || inputValue == undefined || inputValue == "") {
                return "Favor de llenar todos los campos.";
            }
    
            if (Array.isArray(inputValue) && inputValue.length == 0) {
                return "Favor de llenar todos los campos.";
            }
    
            if (inputValue instanceof HTMLElement) {
                const image = inputValue.files.length > 0 ? inputValue.files[0] : "";

                if (image != "") {
                    // IMAGE VALIDATIONS
                    if (image.size > 11365697) {
                        return "El tamaño de la imagen excede el límite, intenta subir otra imagen";
                    }
    
                    if (
                        image.type != "image/png" &&
                        image.type != "image/jpg" &&
                        image.type != "image/jpeg"
                    ) {
                        return "La extensión seleccionada no es compatible para imágenes, favor de utilizar .png .jpg o .jpeg";
                    }
                }
            }
        }
        return "" ;
    }

    async function saveChanges(item, itemType){
        
        let config = {}
        switch(itemType){
            case "product":
                config = productConfig
                break;
                
            case "category":
                config = categoryConfig
                break;

            case "discount":
                config = discountConfig
                break;

            default:
                break;
        }

        const inputValues = getInputValues(config);
        let itemsToUpdate = {};

        // GET ITEMS TO UPDATE (DIFFERENCES BETWEEN DB AND FORM)
        Object.keys(item).forEach(prop => {

            if(prop == "image") return;

            if (inputValues.hasOwnProperty(prop)) {
                const dbValue   = item[prop];
                const formValue = inputValues[prop];

                const areValuesEqual =
                    Array.isArray(dbValue) && Array.isArray(formValue)
                        ? JSON.stringify(dbValue) == JSON.stringify(formValue)
                        : dbValue == formValue;

                if (!areValuesEqual) {
                    itemsToUpdate[prop] = formValue
                }
            }
        });

        // IF THEY ARE ITEMS TO UPDATE, ADD THE ID OF THE ITEM
        if(Object.keys(itemsToUpdate).length > 0 ){
            itemsToUpdate = {
                id: item.id,
                ...itemsToUpdate
            }
        }

        // VALIDATIONS
        let warning = validateFormInput(inputValues)

        let image = ""
        for (const inputValue of Object.values(inputValues)) {
            if (inputValue instanceof HTMLElement) {
                image = inputValue.files.length > 0 ? inputValue.files[0] : "";
            }
        }

        warning = 
            warning == "" && image == "" && Object.keys(itemsToUpdate).length == 0 
            ? "No se encontró ningún cambio a guardar, verifica los datos y vuelve a intentar."
            : ""

        if(warning != ""){
            Swal.fire({
                title: 'Alerta',
                icon: 'warning',
                text: warning,
              });
              return;
        }

        // UPLOAD IMAGE
        if(image != ""){
            const formData = new FormData();
            formData.append("file", image);
            formData.append(
                "upload_preset",
                process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
            );
    
            try {
                const imageUrl = await uploadImage(formData);
    
                itemsToUpdate = {
                    id: item.id,
                    ...itemsToUpdate,
                    image: imageUrl,
                };
    
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: `Ocurrió un error al subir la imagen: ${error}`,
                    });
                    return;
            }
        }

        Swal.fire({
            title: 'Actualizando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
        })

        try{
            const response = await fetch('/api/updateItem', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                   type: itemType,
                   items: itemsToUpdate,
                }),
            });
            
            if (response.ok) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Información actualizada correctamente!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then( res =>{
                    setShowUpdateForm(false);
                });
            }else{
                const errorDetails = await response.json();
                throw new Error(errorDetails.message);
            }
        
        }
        catch (error) {
            Swal.fire({
                title: 'Error',
                html: `Ocurrió un error al actualizar la información:\
                <br/> ${error}`,
                icon: 'error',
                confirmButtonText: 'OK'
                })
        }
    }
    
    function newItem(itemType){

        switch(itemType){
            case "product":
                setProductConfig(productInitialConfig);
                break;

            case "category":
                setCategoryConfig(categoryInitialConfig);
                break;

            case "discount":
                setDiscountConfig(discountInitialConfig);
                break;
            
            default: 
                break;
        }

        setShowUpdateForm(true);

    }

    async function addItem(formType){
        let inputValues
        switch(formType){
            case "product":
                inputValues = getInputValues(productInitialConfig)
                break;

            case "category":
                inputValues = getInputValues(categoryInitialConfig)
                break;

            case "discount":
                inputValues = getInputValues(discountInitialConfig)
                break;

            default: 
                break;
        }
        
        let warning = validateFormInput(inputValues);

        if(warning != ""){
            Swal.fire({
                title: 'Alerta',
                icon: 'warning',
                text: warning,
              });
              return;
        }

        let image = ""
        for (const inputValue of Object.values(inputValues)) {
            if (inputValue instanceof HTMLElement) {
                image = inputValue.files.length > 0 ? inputValue.files[0] : "";
            }
        }

        // UPLOAD IMAGE
        if(image != ""){
            const formData = new FormData();
            formData.append("file", image);
            formData.append(
                "upload_preset",
                process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
            );
    
            try {
                const imageUrl = await uploadImage(formData);
    
                inputValues = {
                    ...inputValues,
                    image: imageUrl,
                };
    
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: `Ocurrió un error al subir la imagen: ${error}`,
                    });
                    return;
            }
        }

        Swal.fire({
            title: 'Agregando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
        })

        try{
            const response = await fetch('/api/addItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                   type:    formType,
                   items:   inputValues,
                }),
            });
            
            if (response.ok) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Registro agregado correctamente!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then( res =>{
                    setShowUpdateForm(false);
                });
            }else{
                const errorDetails = await response.json();
                throw new Error(errorDetails.message);
            }
        
        }
        catch (error) {
            Swal.fire({
                title: 'Error',
                html: `Ocurrió un error al agregar la información:\
                <br/> ${error}`,
                icon: 'error',
                confirmButtonText: 'OK'
                })
        }

    }

    function updateItem(item, itemType){
        switch(itemType){
            case "product":
                    setProductConfig((c) => ({...c, formTitle: "Editar Producto"}));
                    setProductConfig((c) => ({...c, button: {
                        id: 'Save',
                        text: 'Guardar',
                        action: ()=>{ saveChanges(item, itemType) },
                    } }));
            
                    updateConfigInput("product", 0, "text", item.name);
                    updateConfigInput("product", 0, "price", item.price);
                    updateConfigInput("product", 0, "accordion", item.categories);
                break;

            case "category":
                setCategoryConfig((c) => ({...c, formTitle: "Editar Categoría"}));
                setCategoryConfig((c) => ({...c, button: {
                        id: 'Save',
                        text: 'Guardar',
                        action: () => { saveChanges(item, itemType) },
                    } }));
            
                    updateConfigInput("category", 0, "text", item.name);
                break;

            case "discount":
                setDiscountConfig((c) => ({...c, formTitle: "Editar Descuento"}));
                setDiscountConfig((c) => ({...c, button: {
                        id: 'Save',
                        text: 'Guardar',
                        action: ()=>{ saveChanges(item, itemType) },
                    } }));

                updateConfigInput("discount", 0, "text", item.description);
                updateConfigInput("discount", 0, "price", item.percentage);
                break;

            default: 
                break;
        }

        setShowUpdateForm(true);
        window.scrollTo(0, 0);
    }

    function updateConfigInput(sectionType, sectionIndex, inputType, newValue){
        switch(sectionType){
            case "product":
                setProductConfig((prevConfig) => {
                    const updatedSections = prevConfig.sections.map((section, sIndex) => {
                        if (sIndex == sectionIndex) {
                            return {
                                ...section,
                                inputs: section.inputs.map((input) => {
                                    if (input.type == inputType) {
                                        if (inputType == "accordion") {
                                            return {
                                                ...input,
                                                items: input.items.map((item) => ({
                                                    ...item,
                                                    checked: newValue.includes(item.name),
                                                })),
                                            };
                                        }
                                        return {
                                            ...input,
                                            value: newValue,
                                        };
                                    }
                                    return input;
                                }),
                            };
                        }
                        return section;
                    });
            
                    return { ...prevConfig, sections: updatedSections };
                });
                break;

            case "category":
                setCategoryConfig((prevConfig) => {
                    const updatedSections = prevConfig.sections.map((section, sIndex) => {
                        if (sIndex === sectionIndex) {
                            return {
                                ...section,
                                inputs: section.inputs.map((input) => {
                                    if (input.type == inputType){
                                        return {
                                            ...input,
                                            value: newValue,
                                        };
                                    }
                                    return input;
                                }),
                            };
                        }
                        return section;
                    });
            
                    return { ...prevConfig, sections: updatedSections };
                });
                break;

            case "discount":
                setDiscountConfig((prevConfig) => {
                    const updatedSections = prevConfig.sections.map((section, sIndex) => {
                        if (sIndex === sectionIndex) {
                            return {
                                ...section,
                                inputs: section.inputs.map((input) => {
                                    if (input.type == inputType){
                                        return {
                                            ...input,
                                            value: newValue,
                                        };
                                    }
                                    return input;
                                }),
                            };
                        }
                        return section;
                    });
            
                    return { ...prevConfig, sections: updatedSections };
                });
                break;

            default:
                break;
        }
    }

    return(
        <div>
            <Layout 
                CurrentPage={"Catalog"}
                ContentProducts={
                    showUpdateForm 
                    ?
                    <div>
                        <Button onClick={ ()=>{ setShowUpdateForm(false) } } className="view-button back-button">
                            <img src={`./assets/back.png`} className="view-img"/>
                        </Button>
                        <Form config = { productConfig } />
                    </div>
                    :
                    <div className="edit-list-wrapper">
                        <div className="edit-header-wrapper">
                            <h1 className="form-title">Productos</h1>       
                            <Button onClick={ () => newItem("product") } className="add-btn">
                                <img src={`./assets/add.png`} className="add-img"/>
                                Nuevo
                            </Button>
                        </div>
                        <ProductList 
                            isProduct   = { true }
                            products    = { drinks } 
                            enabled     = { true } 
                            actions     = { [{icon: './assets/edit.png', action: updateItem}] }/>
                    </div>
                }
                ContentCategories={
                    showUpdateForm 
                    ?
                    <div>
                        <Button onClick={ ()=>{ setShowUpdateForm(false) } } className="view-button back-button">
                            <img src={`./assets/back.png`} className="view-img"/>
                        </Button>
                        <Form config = { categoryConfig } />
                    </div>
                    :
                    <div className="edit-list-wrapper">
                        <div className="edit-header-wrapper">
                            <h1 className="form-title">Categorías</h1>       
                            <Button onClick={ () => newItem("category") } className="add-btn">
                                <img src={`./assets/add.png`} className="add-img"/>
                                Nuevo
                            </Button>
                        </div>
                        <ProductList 
                            isProduct   = { false }
                            categories  = { categories } 
                            enabled     = { false } 
                            actions     = { [{icon: './assets/edit.png', action: updateItem}] }/>
                    </div>
                }
                ContentDiscounts={
                    showUpdateForm 
                    ?
                    <div>
                        <Button onClick={ ()=>{ setShowUpdateForm(false) } } className="view-button back-button">
                            <img src={`./assets/back.png`} className="view-img"/>
                        </Button>
                        <Form config = { discountConfig } />
                    </div>
                    :
                    <div className="edit-list-wrapper">
                        <div className="edit-header-wrapper">
                            <h1 className="form-title">Descuentos</h1>       
                            <Button onClick={ () => newItem("discount") } className="add-btn">
                                <img src={`./assets/add.png`} className="add-img"/>
                                Nuevo
                            </Button>
                        </div>
                        <ProductList 
                            isProduct   = { false } 
                            isDiscount  = { true }
                            discounts   = { discounts } 
                            enabled     = { false}  
                            actions     = { [{icon: './assets/edit.png', action: updateItem}] }/>
                    </div>
                }
                HandleTabChange={() => setShowUpdateForm(false)}
            />
        </div>
    );
}
export default Catalog;