export const Container = (children:any) => {
  return (
    <div className="w-full bg-slate-700 rounded-lg p-3 h-auto">
      <div className="bg-gray-600 rounded-lg p-2 text-center">{children.title}</div>
      <div className="mt-2">{children.content}</div>
    </div>
  );
};
