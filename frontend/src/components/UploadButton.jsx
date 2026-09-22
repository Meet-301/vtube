import { UploadSimpleIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

function UploadButton({ size, classes }) {
    return (
        <Link
            to="/upload-video"
            aria-label="Upload"
            title="Upload video"
            className={classes}
        >
            <UploadSimpleIcon
                size={size}
                weight="regular"
            />
        </Link>
    )
}

export default UploadButton;