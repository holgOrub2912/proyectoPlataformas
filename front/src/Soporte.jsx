const support_page = import.meta.env.VITE_SUPPORT_PAGE;
const Soporte = ({}) => {
  return (
    <iframe
      src={support_page}
      scrolling="yes"
      seamless
      className="w-full h-150"
    >
    </iframe>
  )
};

export default Soporte;
