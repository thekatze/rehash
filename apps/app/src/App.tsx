import { Component, For } from "solid-js";
import { Link, useNavigate, useRoutes } from "solid-app-router";
import routes from "@/routes";
import { useRehash } from "./providers/RehashProvider";
import PwaUpdateIndicator from "./components/PwaUpdateIndicator";
import {
  Box,
  Container,
  createDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  IconButton,
  Spacer,
  VStack,
} from "@hope-ui/solid";

import MenuIcon from "~icons/majesticons/menu-line";
import HomeIcon from "~icons/majesticons/home-line";
import SettingsIcon from "~icons/majesticons/settings-cog-line";
import ContributeIcon from "~icons/majesticons/git-pull-line";
import AboutIcon from "~icons/majesticons/info-circle-line";
import { useI18n } from "./i18n/I18nProvider";

const navigations = [
  { icon: <HomeIcon />, route: "/", text: "HOME" },
  { icon: <SettingsIcon />, route: "/settings", text: "SETTINGS" },
  { icon: <ContributeIcon />, route: "/contribute", text: "CONTRIBUTE" },
  { icon: <AboutIcon />, route: "/about", text: "ABOUT" },
];

const App: Component = () => {
  const [t] = useI18n();
  const Routes = useRoutes(routes);
  const navigate = useNavigate();
  const [, , store] = useRehash();

  if (!store.unlocked()) {
    store.exists().then((exists) => {
      if (exists) {
        navigate("/unlock");
      } else {
        navigate("/new");
      }
    });
  }

  const { isOpen, onOpen, onClose } = createDisclosure();

  return (
    <>
      <Drawer opened={isOpen()} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading size="2xl" fontWeight="$black">
              rehash
            </Heading>
          </DrawerHeader>

          <DrawerBody>
            <VStack alignItems="stretch">
              <For each={navigations}>
                {(navigation) => (
                  <Box as={Link} href={navigation.route}>
                    {t(navigation.text)}
                  </Box>
                )}
              </For>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <HStack spacing="$4" py="$2" px="$6" mb="$2" as="header">
        <IconButton
          size="sm"
          aria-label="Open menu"
          icon={<MenuIcon />}
          onClick={onOpen}
          variant="ghost"
          fontSize="$2xl"
          css={{ visibility: !store.unlocked() ? "hidden" : "visible" }}
        />
        <Heading size="2xl" fontWeight="$black">
          rehash
        </Heading>
        <Spacer />
        <PwaUpdateIndicator />
      </HStack>
      <Container maxW="$xl">
        <Routes />
      </Container>
    </>
  );
};

export default App;
