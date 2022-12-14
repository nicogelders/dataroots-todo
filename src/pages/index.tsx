import type { NextPage } from "next";
import Head from "next/head";
import { useRef } from "react";
import { trpc } from "../utils/trpc";

const AddTodo: React.FC = () => {
  const client = trpc.useContext();
  const nameInput = useRef<HTMLInputElement>(null);

  const { mutate } = trpc.useMutation("todo.create", {
    onSuccess: () => {
      client.invalidateQueries(["todo.get-all-done"]);
    },
  });

  const handleClick = () => {
    if (!nameInput.current?.value) return;

    mutate({ name: nameInput.current?.value });
    nameInput.current.value = "";
  };

  return (
    <div>
      <input ref={nameInput} className="border border-black" type="text" />
      <input
        type="button"
        className="bg-blue-300 hover:bg-blue-600 p-2 text-white rounded"
        value="add todo"
        onClick={handleClick}
      />
    </div>
  );
};

const TodoItems: React.FC = () => {
  const client = trpc.useContext();
  const { mutate } = trpc.useMutation("todo.toggle-done", {
    onSuccess: () => {
      client.invalidateQueries(["todo.get-all-done"]);
    },
  });

  const { data, isLoading } = trpc.useQuery(["todo.get-all-done"]);

  if (isLoading) return <div>Loading ...</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      {data.map((e) => (
        <div key={e.id}>
          <span>{e.name} </span>
          <input
            type="checkbox"
            checked={e.done}
            onClick={() => {
              mutate({ id: e.id });
            }}
          />
        </div>
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App Hello</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <AddTodo />
        <TodoItems />
      </main>
    </>
  );
};

export default Home;
