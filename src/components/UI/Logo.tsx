import { siteConf } from "@/config/site.conf"
import Image from "next/image"

export default function Logo() {
  return (
    <div className="flex items-center justify-center gap-3">
      
        <Image
          src="sushi.svg"
          alt={siteConf.description}
          width={30}
          height={30}
        />
  
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-gray-900">Japanese</span>
          <span className="-mt-2 text-lg font-semibold text-orange-600">Food</span>
        </div>
      
    </div>
  )
}