import './style.sass'

const Button = ({children, ...props}) => {
    return (
        <button {...props}>
            {children}
        </button>
    );
};

export default Button;