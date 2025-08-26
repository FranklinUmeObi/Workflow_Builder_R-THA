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
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Item
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button color="primary" variant="flat">
            Export
          </Button>
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
