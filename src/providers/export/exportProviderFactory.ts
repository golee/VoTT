import Guard from "../../common/guard";
import { IExportProvider } from "./exportProvider";
import { IProject } from "../../models/applicationState";

export interface IExportProviderRegistrationOptions {
    name: string;
    displayName: string;
    description?: string;
    factory: (project, IProject, options?: any) => IExportProvider;
}

/**
 * @name - Export Provider Factory
 * @description - Creates instance of export providers based on request providery type
 */
export class ExportProviderFactory {
    public static get providers() {
        return { ...ExportProviderFactory.providerRegistery };
    }

    /**
     * Registers a factory method for the specified export provider type
     * @param options - The options to use when registering an export provider
     */
    public static register(options: IExportProviderRegistrationOptions) {
        Guard.null(options);
        Guard.emtpy(options.name);
        Guard.emtpy(options.displayName);
        Guard.null(options.factory);

        ExportProviderFactory.providerRegistery[options.name] = options;
    }

    /**
     * Creates new instances of the specifed export provider
     * @param name - The name of the export provider to instantiate
     * @param project - The project to load into the export provider
     * @param options  - The provider specific options for exporting
     */
    public static create(name: string, project: IProject, options?: any): IExportProvider {
        Guard.emtpy(name);
        Guard.null(project);

        const handler = ExportProviderFactory.providerRegistery[name];
        if (!handler) {
            throw new Error(`No export provider has been registered with name '${name}'`);
        }

        return handler.factory(project, options);
    }

    public static createFromProject(project: IProject): IExportProvider {
        return ExportProviderFactory.create(
            project.exportFormat.providerType,
            project,
            project.exportFormat.providerOptions,
        );
    }

    private static providerRegistery: { [id: string]: IExportProviderRegistrationOptions } = {};
}