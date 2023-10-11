import http from './http-common';
import { AxiosRequestConfig } from 'axios';

export class FileService {
  private static readonly config: AxiosRequestConfig<unknown> = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    responseType: 'json',
    withCredentials: true,
  };

  private static readonly URI = '/file';

  static getFiles = async (
    limit: number,
    pageNumber: number,
    search: string,
    orderBy: string
  ) => {
    return await http.get(
      `/files/get?limit=${limit}&pageNumber=${pageNumber}&search=${search}&orderBy=${orderBy}`
    );
  };

  static getFile = async (fileName: string) => {
    this.config.responseType = 'blob';
    const { headers, data } = await http.get(`file/get/${fileName}`);
    return { headers, data };
  };

  static uploadOneFile = async (fileFormData: FormData) => {
    return await http({
      method: 'post',
      data: fileFormData,
      url: '/file/create',
    });
  };

  static uploadMultipleFiles = async (fileFormData: FormData) => {
    return await http({
      method: 'post',
      data: fileFormData,
      url: '/files/create',
    });
  };

  static deleteFile = async (filename: string) => {
    return await http.get(`file/delete/${filename}`);
  };

  static renameFile = async (oldName: string, newName: string) => {
    return await http.get(
      `/file/edit-name?oldName=${oldName}&newName=${newName}`
    );
  };
}
