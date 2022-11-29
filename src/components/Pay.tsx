import bill20 from "../assets/BILLS/20.jpg";
import bill50 from "../assets/BILLS/51.jpg";
import bill100 from "../assets/BILLS/100.jpg";
import bill200 from "../assets/BILLS/201.jpg";
import { LazyLoadImage } from "react-lazy-load-image-component";
const Bills = [bill20, bill50, bill100, bill200];

function Pay() {
  return (
    <div className="flex flex-col">
      {Bills.map((bill) => (
        <div className="flex">
          <div className="flex flex-col text-[60px] text-center w-1/4">
            <button className="bg-green-400 hover:bg-green-600">+</button>
            <button className="bg-red-300 hover:bg-red-600">-</button>
          </div>
          <LazyLoadImage src={bill} className="h-1/5 w-3/4" alt="Image Alt" />
        </div>
      ))}
    </div>
  );
}

export default Pay;
