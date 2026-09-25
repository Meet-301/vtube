import { Link } from "react-router-dom";
import { useState } from "react";
import { PlusIcon, XIcon } from "@phosphor-icons/react";

function CreatePlaylist() {

    const [playlistName, setPlaylistName] = useState("");
    const [description, setDescription] = useState("");

    return (
        <main className="
            h-[calc(100dvh-4rem)]
            bg-background
            text-text-primary
        ">

            <div className="
                flex
                h-full
                items-center
                justify-center
                px-3
                sm:px-4
            ">

                <div className="w-full max-w-md">

                    {/* ================= CARD ================= */}

                    <div className="
                        rounded-2xl
                        border
                        border-border
                        bg-surface
                        px-4
                        py-5
                        shadow-sm
                        sm:px-8
                        sm:py-7
                    ">

                        {/* ================= HEADING ================= */}

                        <div className="mb-5">

                            <h1 className="
                                text-xl
                                font-semibold
                                tracking-tight
                                sm:text-2xl
                            ">
                                Create playlist
                            </h1>

                            <p className="
                                mt-1.5
                                text-sm
                                leading-5
                                text-text-secondary
                            ">
                                Create a playlist to organize your
                                favorite videos.
                            </p>

                        </div>


                        {/* ================= FORM ================= */}

                        <form className="space-y-4">

                            {/* Playlist Name */}

                            <div className="space-y-2">

                                <label
                                    htmlFor="playlistName"
                                    className="
                                        text-sm
                                        font-medium
                                        text-text-primary
                                    "
                                >
                                    Playlist name
                                </label>

                                <input
                                    id="playlistName"
                                    name="playlistName"
                                    type="text"
                                    value={playlistName}
                                    onChange={(e) =>
                                        setPlaylistName(e.target.value)
                                    }
                                    placeholder="Enter playlist name"
                                    className="
                                        h-11
                                        w-full
                                        rounded-xl
                                        border
                                        border-border
                                        bg-background
                                        px-4
                                        text-sm
                                        text-text-primary
                                        outline-none
                                        placeholder:text-text-muted
                                        transition-all
                                        duration-200
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/20
                                    "
                                />

                            </div>


                            {/* Description */}

                            <div className="space-y-2">

                                <label
                                    htmlFor="description"
                                    className="
                                        text-sm
                                        font-medium
                                        text-text-primary
                                    "
                                >
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows={3}
                                    placeholder="Add a description"
                                    className="
                                        w-full
                                        resize-none
                                        rounded-xl
                                        border
                                        border-border
                                        bg-background
                                        px-4
                                        py-3
                                        text-sm
                                        text-text-primary
                                        outline-none
                                        placeholder:text-text-muted
                                        transition-all
                                        duration-200
                                        focus:border-primary
                                        focus:ring-2
                                        focus:ring-primary/20
                                    "
                                />

                            </div>


                            {/* ================= ACTIONS ================= */}

                            <div className="
                                flex
                                gap-3
                                pt-1
                            ">

                                <Link
                                    to="/playlists"
                                    className="
                                        flex
                                        gap-2
                                        h-11
                                        flex-1
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-border
                                        bg-background
                                        text-sm
                                        font-medium
                                        text-text-primary
                                        transition-all
                                        duration-200
                                        hover:bg-surface-elevated
                                        active:bg-surface-elevated
                                        active:scale-[0.98]
                                    "
                                >
                                    <XIcon size={18}/>

                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    className="
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        h-11
                                        flex-1
                                        rounded-xl
                                        bg-primary
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition-all
                                        duration-200
                                        hover:bg-primary-hover
                                        active:bg-primary-hover
                                        active:scale-[0.98]
                                    "
                                >
                                    <PlusIcon size={18} />

                                    Create
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default CreatePlaylist;