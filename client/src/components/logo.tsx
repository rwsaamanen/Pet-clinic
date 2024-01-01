import logo from './../assets/icons/logo.png'

export const Logo = () => {
  return (
    <div className="md:flex items-center gap-x-2">
      <img
        src={logo}
        height="25"
        width="25"
        alt="Logo"
      />
      <p className='font-semibold hidden md:flex text-xl cursor-pointer'>
        PetVet
      </p>
    </div>
  )
}