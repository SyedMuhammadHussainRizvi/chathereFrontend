import React from 'react'

function ProcessButton(props) {
  return (
    <button className={`bg-${props?.bgcolor} ${props?.borderSpecs}  text-${props.txtColor} text-${props.txtSize} h-${props.height} ${props.width} rounded-lg hover:cursor-pointer`}
        onClick={()=>{props.Onclick()}}
        
    >
        {
            props.isLoading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className={`h-${props.loaderS} w-${props.loaderS} rounded-full border-4 border-${props.loaderColor} border-t-transparent border-l-transparent border-r-transparent animate-spin`}></div>
                    <p>{props.loadingtxt}</p>
                </div>
            ) :(
                <p>{props.txt}</p>
            )
        }
    </button>
  )
}

export default ProcessButton
