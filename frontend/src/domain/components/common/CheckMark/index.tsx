import "./style.css";
type checkMarkProps = {
  message: string;
};
const CheckMark = ({ message }: checkMarkProps) => {
  return (
    <div className="success-container">
      <img src="./favicon.png" alt="Success" className="success-image" />
      <h2 className="check-successfull">{message}</h2>
    </div>
  );
};

export default CheckMark;
