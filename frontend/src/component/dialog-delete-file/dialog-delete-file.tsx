import { Button, Dialog, Flex, TextField, Text, AlertDialog } from '@radix-ui/themes';
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useState } from "react";
import { ItResponse } from "../../model/interface/it-response.ts";
import { FileService } from "../../service/api/file.service.ts";
import { toast } from "react-toastify";
import { deleteFile } from "../../store/slices/file.ts";
import { MyFile } from "../../model/interface/file.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store.ts";

interface DialogDeleteFileProps {
    metaData: MyFile;
    reRender: boolean;
    setReRender: Dispatch<SetStateAction<boolean>>;
}

export default function DialogDeleteFile({metaData, reRender, setReRender}: Readonly<DialogDeleteFileProps>) {
    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = async () => {
        const response: any = await dispatch(deleteFile(metaData));
        if (!response?.error) {
            setReRender(prev => !prev);
        }
    }
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <button
                    className="btn btn-error">
                    <TrashIcon/>
                </button>
            </AlertDialog.Trigger>
            <AlertDialog.Content style={{maxWidth: 450}}>
                <AlertDialog.Title>Delete Item</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    Are you sure? This picture will no longer be accessible.
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                            Cancel
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button variant="solid" color="red" onClick={handleDelete}>
                            Delete
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
}
