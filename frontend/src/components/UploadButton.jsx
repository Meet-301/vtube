import { UploadSimpleIcon } from "@phosphor-icons/react";

function UploadButton({size, classes}) {
    return (
        <button
                        type="button"
                        aria-label="Upload"
                        title="Upload"
                        className={classes}
                    >
                        <UploadSimpleIcon
                            size={size}
                            weight="regular"
                        />
                    </button>
    )
}

export default UploadButton;