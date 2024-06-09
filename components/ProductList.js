import { List } from "antd";

const ProductList = ({products, addItemToCart, enabled, isProduct})=>{
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
                                  <span>{product.qty && `$${product.price} x${product.qty}`}</span>
                                </div>
                              }
                            description={product.category && product.category.map(c => c += " ")} />
                  </List.Item>
                )}
            />
        </div>
    );
}

export default ProductList;