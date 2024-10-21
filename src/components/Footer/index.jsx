import './Footer.css'; // Importando o CSS

function Footer() {
    return (
        <footer className="custom-footer">
            <div className="container">
                <p className="footer-text">
                    &copy; {new Date().getFullYear()} Pagapouco. Todos os direitos reservados.
                </p>
                <ul className="footer-links">
                    <li><a href="/sobre" className="footer-link">Sobre</a></li>
                    <li><a href="/contato" className="footer-link">Contato</a></li>
                    <li><a href="/privacidade" className="footer-link">Política de Privacidade</a></li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
