import { JSONEditor } from "vanilla-jsoneditor";
import { useEffect, useRef } from "react";

export default function JsonEditor(props: any) {
  const refContainer = useRef<any>(null);
  const refEditor = useRef<any>(null);

  useEffect(() => {
    // create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {},
    });

    return () => {
      // destroy editor
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  // update props
  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.updateProps(props);
    }
  }, [props]);

  return (
    <div
      className={props.className || "svelte-jsoneditor-react"}
      ref={refContainer}
    ></div>
  );
}
