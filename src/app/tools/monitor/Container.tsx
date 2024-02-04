import React from 'react';

export const Container = (props:{
  title: string,
  content: React.ReactNode
}) => {
  return (
    <div className="w-full bg-slate-700 rounded-lg p-3 h-auto">
      <div className="bg-gray-600 rounded-lg p-2 text-center">{props.title}</div>
      <div className="mt-2">{props.content}</div>
    </div>
  );
};
