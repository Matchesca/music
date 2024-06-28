"use client";

import uniqid from "uniqid";

import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import useLoadingBar from "@/hooks/useLoadingBar";

import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import { useReducer, useState } from "react";
// import Input from "./Input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

// const tus = require("tus-js-client");
// const projectId = "jsfacqpeqskkbnvhyvxt";

const UploadModal = () => {
  const uploadModal = useUploadModal();
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const router = useRouter();
  const { updateProgress } = useLoadingBar();

  async function uploadFile(file: any) {
    return new Promise((resolve, reject) => {
      var formData = new FormData();
      formData.append("song", file.song);
      formData.append("image", file.image);
      formData.append("email", file.email);

      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:4000/upload", true);

      xhr.onload = function () {
        if (xhr.status === 200) {
          console.log("File uploaded successfully.");
          resolve();
        } else {
          console.log("Failed to upload file.");
          reject(xhr.responseText);
        }
      };

      xhr.onerror = function () {
        console.log("Upload failed.");
        reject(xhr.responseText);
      };

      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          var percentage = ((event.loaded / event.total) * 100).toFixed(2);
          updateProgress(percentage);
          console.log(event.loaded, event.total, percentage + "%");
        }
      };

      xhr.send(formData);
    });
  }

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      // reset form
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      console.log("did not work");
      setIsLoading(true);
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!user || !imageFile || !songFile) {
        toast.error("Missing fields");
        return;
      }

      const uniqueID = uniqid();

      // Prepare data for upload
      const data = {
        song: songFile,
        image: imageFile,
        email: user.email,
      };

      // const { data: songData, error: songError } = await supabaseClient.storage
      //   .from("songs")
      //   .upload(`song-${values.title}-${uniqueID}`, songFile, {
      //     cacheControl: "3600",
      //     upsert: false,
      //   });

      // if (songError) {
      //   setIsLoading(false);
      //   return toast.error("Failed song upload.");
      // }

      // Upload image
      // const { data: imageData, error: imageError } =
      //   await supabaseClient.storage
      //     .from("images")
      //     .upload(`image-${values.title}-${uniqueID}`, imageFile, {
      //       cacheControl: "3600",
      //       upsert: false,
      //     });

      // if (imageError) {
      //   setIsLoading(false);
      //   return toast.error("Failed image uplaod");
      // }

      // const { error: supabaseError } = await supabaseClient
      //   .from("songs")
      //   .insert({
      //     user_id: user.id,
      //     title: values.title,
      //     author: values.author,
      //     image_path: `image-${values.title}-${uniqueID}`,
      //     song_path: `song-${values.title}-${uniqueID}`,
      //   });

      // if (supabaseError) {
      //   setIsLoading(false);
      //   return toast.error(supabaseError.message);
      // }

      try {
        const response = await uploadFile(data);

        router.refresh();
        setIsLoading(false);
        toast.success("Song created!");
        reset();
        uploadModal.onClose();
      } catch (error) {
        setIsLoading(false);
        console.error(error);
        return toast.error("Failed to upload files.");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add a song"
      description="Upload a FLAC file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <div>
          <div className="p-2">Select a song file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3, .flac"
            {...register("song", { required: true })}
          />
        </div>
        <div>
          <div className="p-2">Select an Image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", { required: true })}
          />
        </div>
        <Button
          disabled={isLoading}
          type="submit"
          className="hover:opacity-75 rounded-3xl"
        >
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
