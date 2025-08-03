import { PrismaClient } from "@prisma/client";
import { List } from "antd";

const ProductList = ({products, categories, addItemToCart = () => {}, enabled, contained = false, isProduct, isDiscount = false, sizes = [], milks = [], discounts = [], filterProducts, actions = []})=>{
  if(isProduct){
    return(
      <div>
          <List 
              className={ !contained ? "list-wrapper" : "contained-list-wrapper "}
              dataSource={products}
              split={false}
              renderItem={product => (
                <List.Item className="list-row" onClick={()=> enabled && addItemToCart(product) }>
                  <List.Item.Meta 
                          className={enabled ? "list-product" : ""}
                          avatar={<img className="list-image" alt={product.name} src={product.image != null ? product.image : './assets/product-images/not-found.png'}/>}
                          title={
                              <div className="list-header">
                                <span>
                                  {product.name}
                                  {!enabled && product.quantity && ` x${product.quantity}`}
                                </span> 
                                
                                <span>
                                  {!enabled && product.qty && `$${product.price + sizes.find(s=>s.id==product.size).priceMultiplier} x${product.qty}`}
                                  {
                                    actions.map(a => {
                                      return <img key={a.icon} className="icon" alt="edit-icon" src={a.icon} onClick={ () => {a.action(product, "product")} }/>
                                    })
                                  }
                                </span>
                              </div>
                            }
                          description={
                            <div className="drinkDetails-wrapper">
                              <div>
                                {product.categories && product.categories.map((c)=>{
                                  let category = ""
                                  switch(c){
                                    case "Caliente":
                                      if(enabled){
                                        category = <img key={c} className="category-icon" src="./assets/bonfire.png" alt="Caliente"/>;
                                      }else{
                                        if(product.drinkType == "Caliente") 
                                            category = 
                                              <div>
                                                <img key={c} className="category-icon" src="./assets/bonfire.png" alt="Caliente"/>
                                                <span>Caliente</span>
                                              </div>
                                      }
                                      break;
                                    case "Frio":
                                      if(enabled){
                                        category = <img key={c} className="category-icon" src="./assets/snowflake.png" alt="Frio"/>;
                                      }else{
                                        if(product.drinkType == "Frio") 
                                            category = 
                                            <div>
                                              <img key={c} className="category-icon" src="./assets/snowflake.png" alt="Frio"/>
                                              <span>Frío</span>
                                            </div>;
                                      }
                                      break;
                                    default:
                                      if (enabled) category = c += " "
                                      break;
                                  }
                                  return category
                                })}
                              </div>
                                <span className="icon-wrapper">
                                  {!enabled && <img className="icon" src="./assets/coffee.png" alt="Size"/>}
                                  {!enabled && sizes.find(s=>s.id == product.size).name}
                                </span>
                                <span className="icon-wrapper">
                                  {!enabled && <img className="icon" src="./assets/milk.png" alt="Size"/>}
                                  {!enabled && milks.find(m => m.id == product.milk).name}
                                </span>
                            </div>
                          } />
                </List.Item>
              )}
          />
      </div>
    );
  }else if(!isDiscount){
    return(
      <div>
        <List 
            className="list-wrapper"
            dataSource={categories}
            split={false}
            renderItem={category => (
              <List.Item className="list-row" onClick={() => enabled && filterProducts(category.name)}>
                <List.Item.Meta 
                        className="list-product"
                        avatar={<img className="list-image list-category" alt={category.name} src={category.image != null ? `${!category.image.startsWith('https') ? './assets/' : ''}${category.image}` : './assets/product-images/not-found.png'}/>}
                        title={
                            <div className="list-header">
                              <span>{category.name}</span> 
                              <span>
                                  {
                                    actions.map(a => {
                                      return <img key={a.icon} className="icon" alt="edit-icon" src={a.icon} onClick={ () => {a.action(category, "category")} }/>
                                    })
                                  }
                                </span>
                            </div>
                          }
                        />
              </List.Item>
            )}
        />
      </div>
    );
  }else{
    return(
      <div>
          <List 
              className="list-wrapper"
              dataSource={discounts}
              split={false}
              renderItem={discount => (
                <List.Item className="list-row">
                  <List.Item.Meta 
                          className="list-product"
                          avatar={<img className="list-image list-category" alt={discount.description} src={discount.image != null ? `./assets/${discount.image}` : './assets/product-images/not-found.png'}/>}
                          title={
                              <div className="list-header">
                                <span>{discount.description}</span> 
                                <span>
                                    {
                                      actions.map(a => {
                                        return <img key={a.icon} className="icon" alt="edit-icon" src={a.icon} onClick={ () => {a.action(discount, "discount")} }/>
                                      })
                                    }
                                  </span>
                              </div>
                            }
                          />
                </List.Item>
              )}
          />
        </div>
    );
  }
   
}

export default ProductList;