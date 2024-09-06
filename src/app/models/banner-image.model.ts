
export class BannerImage{
    banner_image_id!: number;
    url!: string;
    mobile!: boolean;

    constructor(url: string){
        this.url = url;
    }
}