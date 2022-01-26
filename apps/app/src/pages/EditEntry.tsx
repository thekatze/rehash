import { useRehash } from "@/providers/RehashProvider";
import { useNavigate, useParams } from "solid-app-router";
import { Component, createResource } from "solid-js";

const EditEntry: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [generator, entries, store] = useRehash();

  const entry = entries.get(params.id);
  if (!entry) navigate("/", {});

  const [password] = createResource(
    () => params.id,
    async () => {
      return await generator.generate(entry!);
    }
  );

  return (
    <div>
      {entry?.displayName}
      <p>{entry?.url}</p>
      <p>{entry?.username}</p>

      <p>{password()}</p>
    </div>
  );
};

export default EditEntry;
