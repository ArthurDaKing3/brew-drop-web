

const Form = (props) =>{
    const config = props.config;

    function chkCategory(categoryName){
        let chk = document.getElementById(`chk_${categoryName}`);
        chk.checked = !chk.checked;
    }

    return(
        <div className="sell-wrapper form-wrapper">
            <h1 className="form-title">{config.formTitle}</h1>
            {
                config.sections.map((section)=>{
                    return(
                        <div key={section.sectionTitle} style={{width: "80%", marginTop: "5%"}}>
                            <h1 className="form-subtitle">{section.sectionTitle}</h1>
                            {section.inputs.map((input)=>{
                                switch(input.type){
                                    case 'text': 
                                        return(
                                            <div key={input.id} className="form-floating mb-3 mt-3">
                                                <input type="text" className="form-control" id={`in_${input.id}`} placeholder="" name={`in_${input.id}`} defaultValue={ input.value } required={ input.required ? true : false }/>
                                                <label htmlFor={`in_${input.id}`}>{input.label}</label>
                                            </div>
                                        );
                                    case 'price':
                                        return(
                                            <div key={input.id} className="form-floating mb-3 mt-3">
                                                <input id={`in_${input.id}`} name={`in_${input.id}`} type="number" min="1" inputMode="numeric" pattern="[0-9]*" placeholder="" defaultValue={ input.value } className="form-control" required={ input.required ? true : false }/>
                                                <label htmlFor={`in_${input.id}`}>{input.label}</label>
                                            </div>
                                        );
                                    case 'accordion':
                                        return(
                                            <div key={input.id} className="accordion" id={`ac_${input.id}`}>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id={`hd_${input.id}`}>
                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#dv_${input.id}`} aria-expanded="true" aria-controls={`dv_${input.id}`}>
                                                        Categorias
                                                    </button>
                                                    </h2>
                                                    <div id={`dv_${input.id}`} className="accordion-collapse collapse" aria-labelledby={`hd_${input.id}`} data-bs-parent={`#ac_${input.id}`}>
                                                        <div className="accordion-body">
                                                        {
                                                            input.items.map((item) =>(
                                                                <div key={item.id} className="input-group mb-3 mt-3 category-list">
                                                                    <span className="input-group-text">
                                                                        <input id={`chk_${item.name}`} type="checkbox" name={`chk_${item.name}`} defaultChecked={item.checked} className="form-check-input"/>
                                                                    </span>
                                                                    <span className="form-control span-category" onClick={()=> chkCategory(item.name)}>{item.name}</span>
                                                                </div>
                                                            ))
                                                        }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    case 'fileUpload':
                                        return(
                                            <div key={input.id} className="form-group mb-3 mt-3">
                                                <input type="file" id={`fl_${input.id}`} name={`fl_${input.id}`} className="form-control"/>
                                            </div>
                                        );
                                }
                            })}
                        </div>
                    );
                })
            }
            <button id={`btn_${config.button.id}`} onClick={() => config.button.action(config.formType)} className="btn btn-success">{config.button.text}</button>
        </div>
    );
}

export default Form;