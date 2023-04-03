import { IconButton } from "@hope-ui/solid";
import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";
import ArrowLeftLineIcon from "~icons/majesticons/arrow-left-line"

const BackButton: Component = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    return <IconButton aria-label="Back" variant="ghost" onClick={goBack} colorScheme="neutral" icon={<ArrowLeftLineIcon />} />
}

export default BackButton;
