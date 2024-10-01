import type { Color } from '@prisma/client'
import styles from './MobileColorSelector.module.css'


const MobileColorSelector = ({colors, colorSelected, changeColorSelected} : {colors: Color[], colorSelected: Color | null, changeColorSelected: (color: Color) => void}) => {

  return (
    <div className={styles.colorsRow} >
      <div className={`max-h-20 overflow-x-scroll`}>
        <div className="w-fit flex gap-2 py-1">
          {colors.map((color, index) => (
            <div
              key={color.id + "mobile-version" + color.hexCode}
              className={`border-4 ${colorSelected == color ? "border-primary-light" : "border-slate-100"} w-14 h-14 hover:cursor-pointer `} 
              style={{backgroundColor: color.hexCode}}
              onClick={() => changeColorSelected(color)}>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MobileColorSelector