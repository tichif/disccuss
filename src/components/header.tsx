import Link from 'next/link';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Input,
  NavbarItem,
} from '@nextui-org/react';

import HeaderAuth from './headerAuth';

const Header = async () => {
  return (
    <Navbar className='shadow mb-6'>
      <NavbarBrand>
        <Link href='/' className='font-bold'>
          Discuss
        </Link>
      </NavbarBrand>
      <NavbarContent justify='center'>
        <NavbarItem>
          <Input />
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify='end'>
        <HeaderAuth />
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
