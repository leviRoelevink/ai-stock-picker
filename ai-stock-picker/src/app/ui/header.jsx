import Image from "next/image";
import upwardsGraph from "../../../public/upwards-stock-market-graph.png";
import { poppins } from "@/app/ui/fonts";

export default function Header() {
  return (
    <header className="bg-black text-white mb-6">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center">
        <Image src={upwardsGraph} alt="Upwards Stock Market Graph" className="w-12 h-12 mr-2" />
        <h1 className={`text-3xl ${poppins.className}`}>
          AI Stock Picker
        </h1>
      </div>
    </header>
  );
}