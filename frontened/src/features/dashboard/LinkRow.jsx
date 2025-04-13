import Table from "../../ui/Table";

export default function LinkRow({ link }) {
  return (
    <Table.Row>
      <div>{link.url}</div>
    </Table.Row>
  );
}

