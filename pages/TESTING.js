


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
    console.log(image);
    // Validations
    let warning = ""
    if(image.length != ""){
        if(image.size > 11365697) warning = "El tamaño de la imagen excede el límite, intenta subir otra imagen"
        if(image.type != "image/png" && image.type != "image/jpg" && image.type != "image/jpeg") warning = `La extensión seleccionada no es compatible para imágenes, favor de utilizar .png .jpg o .jpeg`
    }
    if(selectedCategories.length == 0) warning = "Selecciona al menos una categría para el producto"
    if(price == "") warning = "Ingresa un precio para el producto"
    if(name == "") warning = "Ingresa un nombre para el producto"

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

