import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
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
