import { GlassPanel } from "../styles/home.styled.jsx";

// prettier-ignore
export default function GlassBox({ children, $h }) {
  const baseClass = " glass-form flex items-center justify-center w-full p-20"
  const dynamicClass = $h ? $h  + baseClass : baseClass;
  return (
      <form id="form" name="form" className={dynamicClass}>
        <GlassPanel data-aos="slide-left">
          {children}
        </GlassPanel>
      </form>
  );
}
