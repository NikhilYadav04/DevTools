import { RotatingLines } from "react-loader-spinner";

export default function SpinnerMini() {
  return (
    <RotatingLines
      visible={true}
      height="24"
      width="24"
      strokeColor="blue"
      color="grey"
      strokeWidth="3"
      animationDuration="0.75"
      ariaLabel="rotating-lines-loading"
    />
  );
}
