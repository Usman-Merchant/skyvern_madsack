import { Cross2Icon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";
import {
  WorkflowEditorParameterType,
  WorkflowParameterValueType,
} from "../../types/workflowTypes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ParametersState } from "../FlowRenderer";
import { WorkflowParameterInput } from "../../WorkflowParameterInput";
import { Checkbox } from "@/components/ui/checkbox";
import { getDefaultValueForParameterType } from "../workflowEditorUtils";
import { toast } from "@/components/ui/use-toast";
import { SourceParameterKeySelector } from "../../components/SourceParameterKeySelector";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import CloudContext from "@/store/CloudContext";
import { CredentialSelector } from "../../components/CredentialSelector";

type Props = {
  type: WorkflowEditorParameterType;
  onClose: () => void;
  onSave: (value: ParametersState[number]) => void;
};

const workflowParameterTypeOptions = [
  { label: "string", value: WorkflowParameterValueType.String },
  { label: "float", value: WorkflowParameterValueType.Float },
  { label: "integer", value: WorkflowParameterValueType.Integer },
  { label: "boolean", value: WorkflowParameterValueType.Boolean },
  { label: "file", value: WorkflowParameterValueType.FileURL },
  { label: "JSON", value: WorkflowParameterValueType.JSON },
];

function header(type: WorkflowEditorParameterType) {
  if (type === "workflow") {
    return "Add Input Parameter";
  }
  if (type === "credential") {
    return "Add Credential Parameter";
  }
  if (type === "bitwardenLoginCredential") {
    return "Add Bitwarden Login Credential Parameter";
  }
  if (type === "secret") {
    return "Add Secret Parameter";
  }
  if (type === "creditCardData") {
    return "Add Credit Card Data Parameter";
  }
  return "Add Context Parameter";
}

function WorkflowParameterAddPanel({ type, onClose, onSave }: Props) {
  const isCloud = useContext(CloudContext);
  const [key, setKey] = useState("");
  const [urlParameterKey, setUrlParameterKey] = useState("");
  const [description, setDescription] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [parameterType, setParameterType] =
    useState<WorkflowParameterValueType>("string");
  const [defaultValueState, setDefaultValueState] = useState<{
    hasDefaultValue: boolean;
    defaultValue: unknown;
  }>({
    hasDefaultValue: false,
    defaultValue: null,
  });
  const [sourceParameterKey, setSourceParameterKey] = useState<
    string | undefined
  >(undefined);

  const [identityKey, setIdentityKey] = useState("");
  const [identityFields, setIdentityFields] = useState("");
  const [itemId, setItemId] = useState("");

  const [credentialId, setCredentialId] = useState("");

  return (
    <ScrollArea>
      <ScrollAreaViewport className="max-h-[500px]">
        <div className="space-y-4 p-1">
          <header className="flex items-center justify-between">
            <span>{header(type)}</span>
            <Cross2Icon className="h-6 w-6 cursor-pointer" onClick={onClose} />
          </header>
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Key</Label>
            <Input value={key} onChange={(e) => setKey(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {type === "workflow" && (
            <>
              <div className="space-y-1">
                <Label className="text-xs">Value Type</Label>
                <Select
                  value={parameterType}
                  onValueChange={(value) => {
                    setParameterType(value as WorkflowParameterValueType);
                    setDefaultValueState((state) => {
                      return {
                        ...state,
                        defaultValue: getDefaultValueForParameterType(
                          value as WorkflowParameterValueType,
                        ),
                      };
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {workflowParameterTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={defaultValueState.hasDefaultValue}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        setDefaultValueState({
                          hasDefaultValue: false,
                          defaultValue: null,
                        });
                        return;
                      }
                      setDefaultValueState({
                        hasDefaultValue: true,
                        defaultValue:
                          getDefaultValueForParameterType(parameterType),
                      });
                    }}
                  />
                  <Label className="text-xs text-slate-300">
                    Use Default Value
                  </Label>
                </div>
                {defaultValueState.hasDefaultValue && (
                  <WorkflowParameterInput
                    onChange={(value) => {
                      if (
                        parameterType === "file_url" &&
                        typeof value === "object" &&
                        value &&
                        "s3uri" in value
                      ) {
                        setDefaultValueState((state) => {
                          return {
                            ...state,
                            defaultValue: value.s3uri,
                          };
                        });
                        return;
                      }
                      setDefaultValueState((state) => {
                        return {
                          ...state,
                          defaultValue: value,
                        };
                      });
                    }}
                    type={parameterType}
                    value={defaultValueState.defaultValue}
                  />
                )}
              </div>
            </>
          )}
          {type === "bitwardenLoginCredential" && (
            <>
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">
                  URL Parameter Key
                </Label>
                <Input
                  value={urlParameterKey}
                  onChange={(e) => setUrlParameterKey(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Collection ID</Label>
                <Input
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                />
              </div>
            </>
          )}
          {type === "context" && (
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Source Parameter</Label>
              <SourceParameterKeySelector
                value={sourceParameterKey}
                onChange={setSourceParameterKey}
              />
            </div>
          )}
          {type === "secret" && (
            <>
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Identity Key</Label>
                <Input
                  value={identityKey}
                  onChange={(e) => setIdentityKey(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">
                  Identity Fields
                </Label>
                <Input
                  value={identityFields}
                  onChange={(e) => setIdentityFields(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Collection ID</Label>
                <Input
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                />
              </div>
            </>
          )}
          {type === "creditCardData" && (
            <>
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Item ID</Label>
                <Input
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Collection ID</Label>
                <Input
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                />
              </div>
            </>
          )}
          {
            // temporarily cloud only
            type === "credential" && isCloud && (
              <div className="space-y-1">
                <Label className="text-xs text-slate-300">Credential</Label>
                <CredentialSelector
                  value={credentialId}
                  onChange={(value) => setCredentialId(value)}
                />
              </div>
            )
          }
          <div className="flex justify-end">
            <Button
              onClick={() => {
                if (!key) {
                  toast({
                    variant: "destructive",
                    title: "Failed to add parameter",
                    description: "Key is required",
                  });
                  return;
                }
                if (type === "workflow") {
                  if (
                    parameterType === "json" &&
                    typeof defaultValueState.defaultValue === "string"
                  ) {
                    try {
                      JSON.parse(defaultValueState.defaultValue);
                    } catch (e) {
                      toast({
                        variant: "destructive",
                        title: "Failed to add parameter",
                        description: "Invalid JSON for default value",
                      });
                      return;
                    }
                  }
                  const defaultValue =
                    parameterType === "json" &&
                    typeof defaultValueState.defaultValue === "string"
                      ? JSON.parse(defaultValueState.defaultValue)
                      : defaultValueState.defaultValue;
                  onSave({
                    key,
                    parameterType: "workflow",
                    dataType: parameterType,
                    description,
                    defaultValue: defaultValueState.hasDefaultValue
                      ? defaultValue
                      : null,
                  });
                }
                if (
                  type === "bitwardenLoginCredential" ||
                  type === "secret" ||
                  type === "creditCardData"
                ) {
                  if (!collectionId) {
                    toast({
                      variant: "destructive",
                      title: "Failed to save parameter",
                      description: "Collection ID is required",
                    });
                    return;
                  }
                }
                if (type === "bitwardenLoginCredential") {
                  onSave({
                    key,
                    parameterType: "bitwardenLoginCredential",
                    collectionId,
                    urlParameterKey,
                    description,
                  });
                }
                if (type === "secret") {
                  onSave({
                    key,
                    parameterType: "secret",
                    collectionId,
                    identityFields: identityFields
                      .split(",")
                      .filter((s) => s.length > 0)
                      .map((field) => field.trim()),
                    identityKey,
                    description,
                  });
                }
                if (type === "creditCardData") {
                  onSave({
                    key,
                    parameterType: "creditCardData",
                    collectionId,
                    itemId,
                    description,
                  });
                }
                if (type === "context") {
                  if (!sourceParameterKey) {
                    toast({
                      variant: "destructive",
                      title: "Failed to add parameter",
                      description: "Source parameter key is required",
                    });
                    return;
                  }
                  onSave({
                    key,
                    parameterType: "context",
                    sourceParameterKey,
                    description,
                  });
                }
                if (type === "credential") {
                  if (!credentialId) {
                    toast({
                      variant: "destructive",
                      title: "Failed to add parameter",
                      description: "Credential is required",
                    });
                    return;
                  }
                  onSave({
                    key,
                    parameterType: "credential",
                    credentialId,
                    description,
                  });
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </ScrollAreaViewport>
    </ScrollArea>
  );
}

export { WorkflowParameterAddPanel };
