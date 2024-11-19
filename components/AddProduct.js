
const AddProduct  = ({categories})=>{
    function chkCategory(categoryName){
        let chk = document.getElementById(`chk_${categoryName}`);
        chk.checked = !chk.checked;
    }

    function cleanForm(){
        document.getElementById("in_name").value = "";
        document.getElementById("in_price").value = "";
        categories.map(c=>{
            document.getElementById(`chk_${c.name}`).checked = false;
        });
        document.getElementById("fl_image").value = "";
        document.getElementById("collapseOne").classList.remove("show")
        window.scrollTo(0, 0);
    }

    async function addProduct(){
        const name = document.getElementById("in_name").value;
        const price = document.getElementById("in_price").value;
        const selectedCategories = categories.filter(c=>{
            let chk_category = document.getElementById(`chk_${c.name}`)
            if(chk_category.checked){
                return parseInt(chk_category.value);
            }
        });
        
        const fileInput = document.getElementById("fl_image");
        const image = fileInput.files.length > 0 ? fileInput.files[0] : ""
        
        // Validations
        let warning = ""
        if(name == "") warning = "Ingresa un nombre par el producto"
        if(price === "") warning = "Ingresa un precio para el producto"
        if(selectedCategories.length == 0) warning = "Selecciona al menos una categría para el producto"
        if(image.size > 11365697) warning = "El tamaño de la imagen excede el límite, intenta subir otra imagen"
        if(image.type != "image/png" || image.type != "image/jpg") warning = `La extensión: ${image.type.replace("image/",".")} no es compatible para imágenes, favor de utilizar .png o .jpg`}

        if(warning != ""){
            Swal.fire({
                title: 'Alerta',
                icon: 'warning',
                text: warning,
              });
              return;
        }
        
        Swal.fire({
            title: 'Creando Producto...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            },
        })

        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        
        try {
            const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            });
            const cloudinaryData = await cloudinaryResponse.json();

            const response = await fetch('/api/addProduct', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                    name, 
                    price, 
                    selectedCategories, 
                    imageUrl: cloudinaryData.secure_url  
                }),
            });
            
            if (response.ok) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Producto registrado correctamente!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(res=>{
                    cleanForm();
                });
            }else{
                const errorDetails = await response.json();
                throw new Error(errorDetails.message);
            }
      
        }
        catch (error) {
            Swal.fire({
                title: 'Error',
                html: `No se pudo registrar la venta:\
                <br/> ${error}`,
                icon: 'error',
                confirmButtonText: 'OK'
              })
        }
    }
    return(
        <div className="sell-wrapper form-wrapper">
            <h1 className="form-title">Agregar Producto</h1>

            <div>
                <h1 className="form-subtitle">Datos Generales</h1>
                <div className="form-floating mb-3 mt-3">
                    <input type="text" className="form-control" id="in_name" placeholder="Nombre" name="in_name" required/>
                    <label htmlFor="in_name">Nombre</label>
                </div>
                <div className="form-floating mb-3 mt-3">
                    <input id="in_price" name="in_price" type="number" min="1" inputMode="numeric" pattern="[0-9]*" placeholder="Precio" className="form-control" required/>
                    <label htmlFor="in_price">Precio</label>
                </div>
                <div className="accordion" id="accordionExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Categorias
                        </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                            {
                                categories.map(c=>(
                                    <div key={c.id} className="input-group mb-3 mt-3 category-list">
                                        <span className="input-group-text">
                                            <input id={`chk_${c.name}`} type="checkbox" name={`chk_${c.name}`} value={c.id} className="form-check-input"/>
                                        </span>
                                        <span className="form-control span-category" onClick={()=> chkCategory(c.name)}>{c.name}</span>
                                    </div>
                                ))
                            }
                            </div>
                        </div>
                    </div>
                </div>
                
                
                <h1 className="form-subtitle mt-3">Imagen</h1>
                <div className="form-group mb-3 mt-3">
                    <input type="file" name="fl_image" id="fl_image" className="form-control"/>
                </div>
                <button id="btn_Add" onClick={()=>addProduct()} className="btn btn-success">Agregar</button>
            </div>
        </div>
    );
}

export default AddProduct;