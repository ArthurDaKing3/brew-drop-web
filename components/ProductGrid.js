import { Card, List } from "antd";
import Meta from "antd/es/card/Meta";

const ProductGrid = ({products, addItemToCart, isProduct})=>{
    function filterProducts(){
      
    }
    return(
        <List 
                grid={{ gutter: 20}}
                split={false}
                dataSource={products}
                renderItem={product => (
                  <List.Item className="grid-card">
                    <Card
                        onClick={()=> isProduct ? addItemToCart(product) : filterProducts(product.name)}
                        hoverable
                        size="small"
                        cover={<img className="grid-image" alt={product.name} src={`./assets/product-images/${product.image}`}/>}
                    >
                        <Meta 
                            title={
                              <div className="grid-header">
                                <span>{product.name}</span> 
                                <span>{product.price && `$ ${product.price}`}</span>
                              </div>
                            }
                            description={
                              <div>
                                {product.categories && product.categories.map((c)=>{
                                  let category = ""
                                  switch(c){
                                    case "Caliente":
                                      category = <img key={c} className="category-icon" src="./assets/bonfire.png" alt="Caliente"/>;
                                      break;
                                    case "Frio":
                                      category = <img key={c} className="category-icon" src="./assets/snowflake.png" alt="Caliente"/>;
                                      break;
                                    default:
                                      category = c += " ";
                                      break;
                                  }
                                  return category
                                })}
                              </div>
                            }
                             />
                    </Card>
                  </List.Item>
                )}
            />
    );
}

export default ProductGrid;