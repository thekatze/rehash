import { StoreEntryWithId } from "@rehash/logic";
import { Component } from "solid-js";
import EntryListItem from "./EntryListItem";

interface EntryListProps {
  entries: StoreEntryWithId[];
}

const EntryList: Component<EntryListProps> = (props) => {
  return (
    <li className="list-none">
      {props.entries.map((entry) => {
        return <EntryListItem entry={entry} />;
      })}
    </li>
  );
};

export default EntryList;
