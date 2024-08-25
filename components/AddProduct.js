

const AddProduct  = ({categories})=>{
    function chkCategory(categoryName){
        let chk = document.getElementById(`chk_${categoryName}`) 
        chk.checked = !chk.checked;
    }
    return(
        <div className="sell-wrapper form-wrapper">
            <h1 className="form-title">Agregar Producto</h1>

            <form className="">
                <h1 className="form-subtitle">Datos Generales</h1>
                <div className="form-floating mb-3 mt-3">
                    <input type="text" className="form-control" id="name" placeholder="Nombre" name="name" />
                    <label htmlFor="name">Nombre</label>
                </div>
                <div className="form-floating mb-3 mt-3">
                    <input name="price" type="number" min="1" inputMode="numeric" pattern="[0-9]*" placeholder="Precio" className="form-control" />
                    <label htmlFor="price">Precio</label>
                </div>
                <div class="accordion" id="accordionExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="headingOne">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Categorias
                        </button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                            {
                                categories.map(c=>(
                                    <div key={c.id} className="input-group mb-3 mt-3 category-list">
                                        <span className="input-group-text">
                                            <input id={`chk_${c.name}`} type="checkbox" name="chk" value={c.name} className="form-check-input"/>
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
                    <input type="file" name="image" className="form-control"/>
                </div>
                <button id="btn_Add" className="btn btn-success">Agregar</button>
            </form>
        </div>
    );
}

export default AddProduct;