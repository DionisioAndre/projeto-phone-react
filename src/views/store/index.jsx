import { useNavigate } from 'react-router-dom';
import { setItem, getItem } from '../../services/localStorege';
import { BsFillCartCheckFill, BsFillCartPlusFill } from 'react-icons/bs';
import { ProductContext } from '../../img/ProductContext';
import { useState, useEffect, useContext } from 'react';
import Loading from '../../components/Loading';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import './store.css';

export const Store = () => {
    const [cart, setCart] = useState(() => getItem('carrinhoXt') || []);
    const [totalPrice, setTotalPrice] = useState(0);
    const [filterType, setFilterType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const navigate = useNavigate();
    const { products, loading, error } = useContext(ProductContext);

    const formatImageUrl = (url) => url.replace('/media/', '/api/media/');

    useEffect(() => {
        setItem('carrinhoXt', cart);
        const total = cart.reduce((acc, item) => acc + Number(item.price), 0);
        setTotalPrice(total);
    }, [cart]);

    const handleClick = (item) => {
        const updatedCart = cart.some(e => e.id === item.id) 
            ? cart.filter(e => e.id !== item.id) 
            : [...cart, item];

        setCart(updatedCart);
    };

    const pagar = () => {
        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }
        if (!localStorage.getItem("authToken")) {
            alert("Por favor, inicie a sessão.");
            navigate("/login");
        } else {
            navigate("/carrinho");
        }
    };

    const uniqueTypes = [...new Set(products.map(product => product.tipo))];

    const filteredProducts = products.filter(product => {
        const withinPriceRange = (
            (minPrice === '' || product.price >= Number(minPrice)) &&
            (maxPrice === '' || product.price <= Number(maxPrice))
        );
        const matchesType = filterType === '' || product.tipo === filterType;
        return withinPriceRange && matchesType;
    });

    if (loading) return <Loading />;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="custom-background">
        <Container className="mt-5 ">
            <h2 className='preco' onClick={pagar} style={{ cursor: 'pointer', color: '#2E4C6D' }}>
                <p className="total-paragraph">
                    Comprar <BsFillCartCheckFill /> {totalPrice}
                </p>
            </h2>

            <div className="filter-section mb-4 d-flex align-items-center">
                <Form.Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="me-2"
                    style={{ width: '200px' }}
                >
                    <option value="">Selecione o Tipo do Produto</option>
                    {uniqueTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </Form.Select>
                <Form.Control
                    type="number"
                    placeholder="Preço Mínimo"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="me-2"
                    style={{ width: '150px' }}
                />
                <Form.Control
                    type="number"
                    placeholder="Preço Máximo"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{ width: '150px' }}
                />
            </div>

            <Row>
                {filteredProducts.map((e) => (
                    <Col key={e.id} xs={12} sm={6} md={4} className="mb-4">
                        <Card className="custom-card">
                            <Card.Img variant="top" src={formatImageUrl(e.image)} alt={e.name || "Produto"} className="cor" />
                            <Card.Body>
                                <Card.Title style={{ color: '#2E4C6D' }}>{e.name}</Card.Title>
                                <Card.Text style={{ color: '#2E4C6D' }}>{e.tipo}</Card.Text>
                                <Card.Text style={{ color: '#2E4C6D' }}>{e.description}</Card.Text>
                                <Card.Text>
                                    Preço: kz {e.price} - 
                                    <Button onClick={() => handleClick(e)} className="btn-cart ml-2">
                                        {cart.some(itemCart => itemCart.id === e.id) ? (
                                            <BsFillCartCheckFill />
                                        ) : (
                                            <BsFillCartPlusFill />
                                        )}
                                    </Button>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
        </div>
    );
};
