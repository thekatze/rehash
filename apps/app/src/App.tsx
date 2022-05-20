import { Component, For } from "solid-js";
import { Link, useRoutes } from "solid-app-router";
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
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Text,
  VStack,
} from "@hope-ui/solid";

import MenuIcon from "~icons/majesticons/menu-line";
import HomeIcon from "~icons/majesticons/home-line";
import SettingsIcon from "~icons/majesticons/settings-cog-line";
import ContributeIcon from "~icons/majesticons/git-pull-line";
import { useI18n } from "./i18n/I18nProvider";
import AuthGuard from "./components/AuthGuard";

const navigations = [
  { icon: HomeIcon, route: "/", text: "HOME" },
  { icon: SettingsIcon, route: "/settings", text: "SETTINGS" },
  { icon: ContributeIcon, route: "/contribute", text: "CONTRIBUTE" },
];

const App: Component = () => {
  const [t] = useI18n();
  const Routes = useRoutes(routes);
  const [, , store] = useRehash();

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
            <VStack alignItems="stretch" spacing="$2">
              <For each={navigations}>
                {(navigation) => (
                  <Box
                    as={Link}
                    href={navigation.route}
                    _hover={{ backgroundColor: "$accent4" }}
                    px="$2"
                    py="$4"
                    justifyItems="center"
                  >
                    <Icon as={navigation.icon} mb="$1" fontSize="$xl" mr="$4" />
                    {t(navigation.text)}
                  </Box>
                )}
              </For>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Text color="gray">
              {t("VERSION", { version: __GIT_REVISION__ })}
            </Text>
          </DrawerFooter>
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
      <Container maxW="$xl" px="$4">
        <AuthGuard>
          <Routes />
        </AuthGuard>
      </Container>
    </>
  );
};

export default App;
