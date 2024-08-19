import { PrismaClient } from "@prisma/client";
import { List } from "antd";

const ProductList = ({products, addItemToCart, enabled, isProduct, sizes, milks})=>{
  function filterProducts(){
      
  }
    return(
        <div>
            <List 
                className="list-wrapper"
                dataSource={products}
                split={false}
                renderItem={product => (
                  <List.Item className="list-row" onClick={()=> enabled && (isProduct ? addItemToCart(product) : filterProducts(product.name))}>
                    <List.Item.Meta 
                            className={enabled ? "list-product" : ""}
                            avatar={<img className="list-image" alt={product.name} src={`./assets/product-images/${product.image}`}/>}
                            title={
                                <div className="list-header">
                                  <span>{product.name}</span> 
                                  
                                  <span>{!enabled && product.qty ? `$${product.price + sizes.find(s=>s.id==product.size).priceMultiplier} x${product.qty}` : `$${product.price}`}</span>
                                </div>
                              }
                            description={
                              <div>
                                {product.categories && product.categories.map((c)=>{
                                  let category = ""
                                  switch(c){
                                    case "Caliente":
                                      if(enabled){
                                        category = <img key={c} className="category-icon" src="./assets/bonfire.png" alt="Caliente"/>;
                                      }else{
                                        if(product.drinkType == "Caliente") category = <img key={c} className="category-icon" src="./assets/bonfire.png" alt="Caliente"/>;
                                      }
                                      break;
                                    case "Frio":
                                      if(enabled){
                                        category = <img key={c} className="category-icon" src="./assets/snowflake.png" alt="Frio"/>;
                                      }else{
                                        if(product.drinkType == "Frio") category = <img key={c} className="category-icon" src="./assets/snowflake.png" alt="Frio"/>;
                                      }
                                      // category = enabled && <img key={c} className="category-icon" src="./assets/snowflake.png" alt="Caliente"/>;
                                      break;
                                    default:
                                      category = c += " ";
                                      break;
                                  }
                                  return category
                                })}
                                  <span>
                                    {!enabled && <img className="icon" src="./assets/coffee.png" alt="Size"/>}
                                    {!enabled && sizes.find(s=>s.id == product.size).name}
                                  </span>
                                  <span>
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
}

export default ProductList;