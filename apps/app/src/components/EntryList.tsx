import { StoreEntryWithId } from "@rehash/logic";
import { Component, For } from "solid-js";
import EntryListItem from "./EntryListItem";

interface EntryListProps {
  entries: StoreEntryWithId[];
}

const EntryList: Component<EntryListProps> = (props) => {
  return (
    <li className="list-none">
      <For each={props.entries}>
        {(entry) => {
          return <EntryListItem entry={entry} />;
        }}
      </For>
    </li>
  );
};

export default EntryList;
