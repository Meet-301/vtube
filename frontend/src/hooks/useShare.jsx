import { notifications } from "@mantine/notifications";
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";

export function useShare() {

    async function share({ path, title }) {
        //! origin + route in frontend so that it'll be a valid link in live site also
        const url = `${window.location.origin}${path}`;

        //! native share sheet on mobile 
        const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

        if (isMobile && navigator.share) {
            try {
                await navigator.share({ title, url });
                return;
            } catch (error) {
                //! if user closes the share sheet then don't show anything
                if (error.name === "AbortError") return;
            }
        }

        //! copy the link in the clipboard in desktop
        try {
            await navigator.clipboard.writeText(url);

            notifications.show({
                title: "Link copied",
                icon: <CheckCircleIcon />,
                color: "vtube",
            });
        } catch {
            notifications.show({
                title: "Could not copy the link",
                color: "red",
                icon: <WarningCircleIcon />,
            });
        }
    }

    return { share };
}