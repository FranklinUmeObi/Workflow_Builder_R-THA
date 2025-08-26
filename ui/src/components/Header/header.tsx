import {
  Navbar as HeroUINavbar,
  NavbarBrand,
} from "@heroui/navbar";

export const Header = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarBrand>
        <p className="font-bold text-inherit">REKORD</p>
      </NavbarBrand>
    </HeroUINavbar>
  );
};
